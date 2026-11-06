import { Router } from 'express';
import db from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

const DEFAULT_BRANDS = [
  'Nike', 'Adidas', 'Jordan', 'Lacoste', 'Boss', 'Palm Angels',
  'Puma', 'New Balance', 'Trapstar', 'Corteiz', 'Syna World',
  'Under Armour', 'Asics', 'Vans'
];

// GET /api/brands - returns unique list of all brands (from MongoDB brands collection + products)
router.get('/', async (req, res) => {
  try {
    if (!db) {
      return res.json(DEFAULT_BRANDS);
    }

    const brandsCol = db.collection('brands');
    const productsCol = db.collection('products');

    const [savedBrands, productBrands] = await Promise.all([
      brandsCol.find().toArray(),
      productsCol.distinct('brand')
    ]);

    const brandMap = new Map();

    DEFAULT_BRANDS.forEach(b => brandMap.set(b.toLowerCase(), b));
    savedBrands.forEach(b => {
      if (b.name) brandMap.set(b.name.trim().toLowerCase(), b.name.trim());
    });
    productBrands.forEach(b => {
      if (b) brandMap.set(String(b).trim().toLowerCase(), String(b).trim());
    });

    const uniqueBrands = Array.from(brandMap.values());
    res.json(uniqueBrands);
  } catch (err) {
    console.error('Get brands error:', err);
    res.json(DEFAULT_BRANDS);
  }
});

// POST /api/brands - Admin saves a new brand into MongoDB
router.post('/', requireAdmin, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'MongoDB indisponible.' });
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Nom de la marque requis.' });
    }
    const brandName = name.trim();
    const brandsCol = db.collection('brands');

    await brandsCol.updateOne(
      { name: { $regex: new RegExp('^' + brandName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') } },
      { $setOnInsert: { name: brandName, created_at: new Date() } },
      { upsert: true }
    );

    console.log(`✓ Brand "${brandName}" saved in MongoDB.`);
    res.status(201).json({ success: true, brand: brandName, message: `Marque "${brandName}" enregistrée avec succès.` });
  } catch (err) {
    console.error('Save brand error:', err);
    res.status(500).json({ message: 'Erreur lors de l’enregistrement de la marque.' });
  }
});

export default router;

