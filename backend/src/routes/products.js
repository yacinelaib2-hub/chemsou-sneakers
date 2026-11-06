import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { ObjectId, Binary } from 'mongodb';
import db from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: automatically apply soft flou edges to any image uploaded by admin
const applyFlouEdges = async (filePath) => {
  try {
    const pythonScript = path.join(__dirname, '../../feather_image.py');
    if (fs.existsSync(pythonScript)) {
      await execFileAsync('python', [pythonScript, filePath]);
      console.log('✓ Applied flou edges to uploaded image:', filePath);
    }
  } catch (err) {
    console.warn('Could not apply flou edges to uploaded file:', err.message);
  }
};

const router = Router();

// Configure multer for temporary image uploads before saving to MongoDB
const tempUploadDir = path.join(__dirname, '../../uploads/temp');
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempUploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, 'temp-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Format d’image non supporté.'));
  }
});

// Helper: Build query to match either MongoDB ObjectId or numeric_id
const buildIdQuery = (param) => {
  const queries = [];
  if (ObjectId.isValid(param)) {
    queries.push({ _id: new ObjectId(param) });
  }
  const num = Number(param);
  if (!isNaN(num)) {
    queries.push({ numeric_id: num });
    queries.push({ id: num });
  }
  return queries.length === 1 ? queries[0] : { $or: queries };
};

// Fallback catalog in case MongoDB is temporarily connecting or unconfigured in serverless
const DEFAULT_PRODUCTS = [
  { id: 13, name: "T-Shirt Streetwear Adidas Trefoil", brand: "adidas", category: "Vêtements", gender: "Homme", price: 2500, old_price: null, image: "/assets/placeholder.png", sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 5 }, { size: "M", stock: 5 }, { size: "L", stock: 5 }, { size: "XL", stock: 5 }, { size: "XXL", stock: 5 }], description: "T-Shirt 100% coton coupe oversize décontractée." },
  { id: 12, name: "Nike Air Max Plus TN Premium Scorpion", brand: "Nike", category: "Sneakers", gender: "Homme", price: 39900, old_price: 45000, image: "/assets/products/tn_12.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 5 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "Édition Premium exclusive avec finitions chrome bleutées." },
  { id: 11, name: "Nike Air Max Plus 3 TN Triple White", brand: "Nike", category: "Sneakers", gender: "Homme", price: 37900, old_price: 42500, image: "/assets/products/tn_11.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "Silhouette TN 3 tout en blanc immaculé." },
  { id: 10, name: "Nike Air Max Plus 3 TN Black & Smoke", brand: "Nike", category: "Sneakers", gender: "Homme", price: 37900, old_price: 42500, image: "/assets/products/tn_10.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "La légendaire TN 3 contrefort arrière aérodynamique futuriste." },
  { id: 9, name: "Nike Air Max Plus TN Limelight Volt", brand: "Nike", category: "Sneakers", gender: "Homme", price: 35000, old_price: 39000, image: "/assets/products/tn_9.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "Coloris Volt électrique hautement contrasté." },
  { id: 8, name: "Nike Air Max Plus TN Chrome Yellow", brand: "Nike", category: "Sneakers", gender: "Homme", price: 36000, old_price: 40000, image: "/assets/products/tn_8.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "Inspiré du mythique coucher de soleil caribéen." },
  { id: 7, name: "Nike Air Max Plus TN SE Laser Crimson", brand: "Nike", category: "Sneakers", gender: "Homme", price: 38500, old_price: 43000, image: "/assets/products/tn_7.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "Design agressif et flammes TPU injectées." },
  { id: 6, name: "Nike Air Max Plus TN Canyon Purple & Volt", brand: "Nike", category: "Sneakers", gender: "Homme", price: 37500, old_price: 41500, image: "/assets/products/tn_6.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "Dégradé violet mystique et nervures néon." },
  { id: 5, name: "Nike Air Max Plus TN Football Blue", brand: "Nike", category: "Sneakers", gender: "Homme", price: 35500, old_price: 39500, image: "/assets/products/tn_5.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "Inspiration marine avec teintes bleues profondes." },
  { id: 4, name: "Nike Air Max Plus TN Dusty Cactus", brand: "Nike", category: "Sneakers", gender: "Homme", price: 36000, old_price: 39500, image: "/assets/products/tn_4.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "Empeigne noire rehaussée de touches turquoise Tiffany." },
  { id: 3, name: "Nike Air Max Plus TN Triple White", brand: "Nike", category: "Sneakers", gender: "Homme", price: 34500, old_price: 38000, image: "/assets/products/tn_3.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "Silhouette immaculée en blanc éclatant." },
  { id: 2, name: "Nike Air Max Plus TN Tough Red Shark", brand: "Nike", category: "Sneakers", gender: "Homme", price: 36900, old_price: 41000, image: "/assets/products/tn_2.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "Mythique dégradé Requin rouge sang et noir profond." },
  { id: 1, name: "Nike Air Max Plus TN Triple Black", brand: "Nike", category: "Sneakers", gender: "Homme", price: 34500, old_price: 38000, image: "/assets/products/tn_1.png", sizes: [{ size: "39", stock: 6 }, { size: "40", stock: 6 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 6 }, { size: "44", stock: 6 }, { size: "45", stock: 6 }], description: "L'incontournable Requin Triple Black aux nervures TPU ondulées." }
];

// GET all products from MongoDB
router.get('/', async (req, res) => {
  try {
    if (!db) {
      return res.json(DEFAULT_PRODUCTS);
    }

    const productsCol = db.collection('products');
    const docs = await productsCol.find({ active: { $ne: false } }).sort({ numeric_id: -1, _id: -1 }).toArray();

    const formatted = docs.map(p => {
      const pid = p.numeric_id !== undefined ? p.numeric_id : p._id.toString();
      // Ensure image URL points to the MongoDB image streaming route if stored in Mongo
      const imageUrl = p.image_base64 || p.image_binary
        ? `/api/products/${pid}/image`
        : (p.image || '/assets/placeholder.png');

      return {
        id: pid,
        _id: p._id.toString(),
        name: p.name,
        brand: p.brand,
        category: p.category || 'Sneakers',
        gender: p.gender || 'Homme',
        price: Number(p.price),
        old_price: p.old_price ? Number(p.old_price) : null,
        image: imageUrl,
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [imageUrl],
        description: p.description || '',
        sizes: Array.isArray(p.sizes) ? p.sizes : []
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des produits depuis MongoDB.' });
  }
});

// GET product picture directly from MongoDB
router.get('/:id/image', async (req, res) => {
  try {
    if (!db) {
      const pid = parseInt(req.params.id, 10);
      const tnPath = path.join(__dirname, `../../assets/products/tn_${pid}.png`);
      if (fs.existsSync(tnPath)) {
        res.setHeader('Content-Type', 'image/png');
        return res.sendFile(tnPath);
      }
      return res.redirect('/assets/placeholder.png');
    }

    const productsCol = db.collection('products');
    const product = await productsCol.findOne(buildIdQuery(req.params.id));

    if (!product) {
      return res.status(404).send('Image non trouvée');
    }

    // If stored as BSON Binary or Base64 in MongoDB
    if (product.image_binary) {
      const buffer = product.image_binary.buffer || Buffer.from(product.image_binary);
      res.setHeader('Content-Type', product.image_mimetype || 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(buffer);
    } else if (product.image_base64) {
      const buffer = Buffer.from(product.image_base64, 'base64');
      res.setHeader('Content-Type', product.image_mimetype || 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(buffer);
    }

    // Fallback: if there was a local asset path
    if (product.image && !product.image.startsWith('/api')) {
      const localPath = path.join(__dirname, '../../', product.image);
      if (fs.existsSync(localPath)) {
        return res.sendFile(localPath);
      }
    }

    res.redirect('/assets/placeholder.png');
  } catch (err) {
    console.error('Serve image error:', err);
    res.status(500).send('Erreur lors du chargement de l’image');
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'BDD indisponible' });

    const productsCol = db.collection('products');
    const p = await productsCol.findOne(buildIdQuery(req.params.id));
    if (!p) return res.status(404).json({ message: 'Produit non trouvé.' });

    const pid = p.numeric_id !== undefined ? p.numeric_id : p._id.toString();
    const imageUrl = (p.image_base64 || p.image_binary) ? `/api/products/${pid}/image` : (p.image || '/assets/placeholder.png');

    res.json({
      id: pid,
      _id: p._id.toString(),
      name: p.name,
      brand: p.brand,
      category: p.category,
      gender: p.gender || 'Homme',
      price: Number(p.price),
      old_price: p.old_price ? Number(p.old_price) : null,
      image: imageUrl,
      images: Array.isArray(p.images) && p.images.length ? p.images : [imageUrl],
      description: p.description,
      sizes: p.sizes || []
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// POST add product (Admin) - Saves product and picture directly in MongoDB
router.post('/', requireAdmin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 5 }]), async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'MongoDB indisponible.' });

    const { name, brand, category, gender, price, old_price, description, sizes } = req.body;
    if (!name || !brand || !price) {
      return res.status(400).json({ message: 'Nom, marque et prix obligatoires.' });
    }

    const productsCol = db.collection('products');

    // Determine highest numeric_id
    const highest = await productsCol.find().sort({ numeric_id: -1 }).limit(1).toArray();
    const nextNumericId = (highest.length > 0 && typeof highest[0].numeric_id === 'number') ? highest[0].numeric_id + 1 : Date.now();

    let imgBuffer = null;
    let base64 = '';
    let mime = 'image/png';
    let sizeBytes = 0;

    // Process main uploaded picture
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];
      await applyFlouEdges(file.path);

      if (fs.existsSync(file.path)) {
        imgBuffer = fs.readFileSync(file.path);
        base64 = imgBuffer.toString('base64');
        mime = file.mimetype || 'image/png';
        sizeBytes = imgBuffer.length;
        // Clean up temporary disk file
        try { fs.unlinkSync(file.path); } catch (e) {}
      }
    }

    // If gallery images uploaded, clean up temporary files
    if (req.files?.gallery) {
      for (const f of req.files.gallery) {
        try { fs.unlinkSync(f.path); } catch (e) {}
      }
    }

    // Parse sizes
    let parsedSizes = [];
    if (sizes) {
      try {
        parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      } catch (e) {
        if (typeof sizes === 'string') {
          parsedSizes = sizes.split(',').map(s => ({ size: s.trim(), stock: 6 })).filter(s => s.size);
        }
      }
    }
    if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
      const defaultSizes = category === 'Vêtements' ? ['XS', 'S', 'M', 'L', 'XL', 'XXL'] : ['39', '40', '41', '42', '43', '44', '45'];
      parsedSizes = defaultSizes.map(s => ({ size: String(s), stock: 6 }));
    }

    // Auto-save brand into MongoDB brands collection so admin can reuse it
    if (brand && brand.trim()) {
      const bName = brand.trim();
      const escaped = bName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      db.collection('brands').updateOne(
        { name: { $regex: new RegExp('^' + escaped + '$', 'i') } },
        { $setOnInsert: { name: bName, created_at: new Date() } },
        { upsert: true }
      ).catch(e => console.warn('Could not auto-save brand:', e.message));
    }

    const imageUrl = `/api/products/${nextNumericId}/image`;
    const dataUri = base64 ? `data:${mime};base64,${base64}` : '';

    const newDoc = {
      numeric_id: nextNumericId,
      name: name.trim(),
      brand: brand.trim(),
      category: category || 'Sneakers',
      gender: gender || 'Homme',
      price: parseFloat(price),
      old_price: old_price ? parseFloat(old_price) : null,
      description: description || '',
      // Image saved directly in MongoDB
      image: imageUrl,
      image_data_uri: dataUri,
      image_base64: base64,
      image_binary: imgBuffer ? new Binary(imgBuffer) : null,
      image_mimetype: mime,
      image_size_bytes: sizeBytes,
      images: [imageUrl],
      sizes: parsedSizes,
      active: true,
      created_at: new Date()
    };

    const insertResult = await productsCol.insertOne(newDoc);
    console.log(`✓ Added product "${name}" (ID ${nextNumericId}) with image saved in MongoDB!`);

    res.status(201).json({
      id: nextNumericId,
      _id: insertResult.insertedId.toString(),
      message: 'Produit et image enregistrés avec succès dans MongoDB.'
    });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Erreur lors de l’ajout du produit dans MongoDB.' });
  }
});

// PUT update product (Admin) - Updates price, promo, photo, sizes, and details in MongoDB
router.put('/:id', requireAdmin, upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'MongoDB indisponible.' });

    const productsCol = db.collection('products');
    const query = buildIdQuery(req.params.id);

    const existingProduct = await productsCol.findOne(query);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Article non trouvé dans MongoDB.' });
    }

    const pid = existingProduct.numeric_id !== undefined ? existingProduct.numeric_id : existingProduct._id.toString();
    const updateDoc = {};

    const { name, brand, category, gender, price, old_price, description, sizes } = req.body;

    if (name) updateDoc.name = name.trim();
    if (brand) {
      updateDoc.brand = brand.trim();
      const bName = brand.trim();
      const escaped = bName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      db.collection('brands').updateOne(
        { name: { $regex: new RegExp('^' + escaped + '$', 'i') } },
        { $setOnInsert: { name: bName, created_at: new Date() } },
        { upsert: true }
      ).catch(e => console.warn('Could not auto-save brand on update:', e.message));
    }
    if (category) updateDoc.category = category;
    if (gender) updateDoc.gender = gender;
    if (description !== undefined) updateDoc.description = description;

    if (price !== undefined && price !== '') {
      updateDoc.price = parseFloat(price);
    }
    if (old_price !== undefined) {
      updateDoc.old_price = (old_price !== '' && old_price !== null && !isNaN(parseFloat(old_price)))
        ? parseFloat(old_price)
        : null;
    }

    // Process sizes if provided
    if (sizes) {
      let parsedSizes = [];
      try {
        parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      } catch (e) {
        if (typeof sizes === 'string') {
          parsedSizes = sizes.split(',').map(s => ({ size: s.trim(), stock: 6 })).filter(s => s.size);
        }
      }
      if (Array.isArray(parsedSizes) && parsedSizes.length > 0) {
        updateDoc.sizes = parsedSizes.map(s => ({
          size: String(s.size).trim(),
          stock: typeof s.stock === 'number' ? s.stock : (parseInt(s.stock, 10) || 0)
        }));
      }
    }

    // Process new image upload if provided
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];
      await applyFlouEdges(file.path);

      if (fs.existsSync(file.path)) {
        const imgBuffer = fs.readFileSync(file.path);
        const base64 = imgBuffer.toString('base64');
        const mime = file.mimetype || 'image/png';
        const sizeBytes = imgBuffer.length;

        updateDoc.image_binary = new Binary(imgBuffer);
        updateDoc.image_base64 = base64;
        updateDoc.image_mimetype = mime;
        updateDoc.image_size_bytes = sizeBytes;
        updateDoc.image_data_uri = `data:${mime};base64,${base64}`;
        updateDoc.image = `/api/products/${pid}/image`;
        updateDoc.images = [`/api/products/${pid}/image`];

        try { fs.unlinkSync(file.path); } catch (e) {}
      }
    }

    updateDoc.updated_at = new Date();

    await productsCol.updateOne(query, { $set: updateDoc });

    const updated = await productsCol.findOne(query);
    const updatedImageUrl = (updated.image_base64 || updated.image_binary)
      ? `/api/products/${pid}/image`
      : (updated.image || '/assets/placeholder.png');

    console.log(`✓ Updated product "${updated.name}" (ID ${req.params.id}) in MongoDB.`);

    res.json({
      success: true,
      message: 'Article mis à jour avec succès dans MongoDB.',
      product: {
        id: pid,
        _id: updated._id.toString(),
        name: updated.name,
        brand: updated.brand,
        category: updated.category,
        gender: updated.gender || 'Homme',
        price: Number(updated.price),
        old_price: updated.old_price ? Number(updated.old_price) : null,
        image: updatedImageUrl,
        images: Array.isArray(updated.images) && updated.images.length ? updated.images : [updatedImageUrl],
        description: updated.description || '',
        sizes: Array.isArray(updated.sizes) ? updated.sizes : []
      }
    });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit dans MongoDB.' });
  }
});

// PATCH toggle or update size stock (Admin) - fast 1-click "khlass / disponible" toggle
router.patch('/:id/toggle-size', requireAdmin, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'MongoDB indisponible.' });

    const { size, stock } = req.body;
    if (!size) {
      return res.status(400).json({ message: 'Pointure obligatoire.' });
    }

    const productsCol = db.collection('products');
    const query = buildIdQuery(req.params.id);

    const product = await productsCol.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Article non trouvé dans MongoDB.' });
    }

    const sizes = Array.isArray(product.sizes) ? [...product.sizes] : [];
    const sizeStr = String(size).trim();
    const existingIndex = sizes.findIndex(s => String(s.size).trim() === sizeStr);

    let newStock;
    if (stock !== undefined) {
      newStock = Math.max(0, parseInt(stock, 10) || 0);
    } else {
      // Toggle logic: if > 0, set to 0 (khlas). If <= 0, set to 6 (disponible).
      const currentStock = existingIndex >= 0 ? (sizes[existingIndex].stock || 0) : 0;
      newStock = currentStock > 0 ? 0 : 6;
    }

    if (existingIndex >= 0) {
      sizes[existingIndex].stock = newStock;
    } else {
      sizes.push({ size: sizeStr, stock: newStock });
    }

    await productsCol.updateOne(query, {
      $set: {
        sizes,
        updated_at: new Date()
      }
    });

    const pid = product.numeric_id !== undefined ? product.numeric_id : product._id.toString();
    console.log(`✓ Size ${sizeStr} for "${product.name}" set to stock=${newStock} in MongoDB.`);

    res.json({
      success: true,
      size: sizeStr,
      newStock,
      isAvailable: newStock > 0,
      sizes
    });
  } catch (err) {
    console.error('Toggle size error:', err);
    res.status(500).json({ message: 'Erreur lors de la modification de la pointure.' });
  }
});

// DELETE product (Admin) - Removes product and picture completely from MongoDB
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'MongoDB indisponible.' });

    const productsCol = db.collection('products');
    const query = buildIdQuery(req.params.id);

    const productToDelete = await productsCol.findOne(query);
    if (!productToDelete) {
      return res.status(404).json({ message: 'Article non trouvé dans MongoDB.' });
    }

    const deleteResult = await productsCol.deleteOne(query);

    console.log(`✓ Deleted product "${productToDelete.name}" (ID ${req.params.id}) and its image from MongoDB.`);
    res.json({
      success: true,
      deletedCount: deleteResult.deletedCount,
      message: `L'article "${productToDelete.name}" et son image ont été définitivement supprimés de MongoDB.`
    });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Erreur lors de la suppression dans MongoDB.' });
  }
});

export default router;
