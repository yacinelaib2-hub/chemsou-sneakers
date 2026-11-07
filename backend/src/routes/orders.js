import { Router } from 'express';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import db from '../db.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

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
  queries.push({ order_number: String(param) });
  return queries.length === 1 ? queries[0] : { $or: queries };
};

let standaloneOrders = [];

// Place Order
router.post('/', optionalAuth, async (req, res) => {
  // Block owner / admin from ordering on their own shop
  if (req.user && req.user.role === 'admin') {
    return res.status(403).json({
      message: 'En tant que propriétaire / administrateur du magasin, vous ne pouvez pas passer de commande sur votre propre boutique.'
    });
  }

  const { customer_name, phone, wilaya, commune, items } = req.body;
  if (!customer_name || !phone || !wilaya || !commune || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Vérifie le nom, le numéro de téléphone, la wilaya, la commune et le panier.' });
  }

  if (!db) {
    const orderNumber = 'CS-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: Date.now(),
      order_number: orderNumber,
      customer_name,
      phone,
      wilaya,
      commune,
      total: req.body.total || 35000,
      delivery_fee: 600,
      status: 'pending',
      items,
      created_at: new Date()
    };
    standaloneOrders.unshift(newOrder);
    return res.status(201).json({
      success: true,
      order_number: orderNumber,
      orderId: newOrder.id,
      total: newOrder.total
    });
  }

  try {
    const productsCol = db.collection('products');
    const ordersCol = db.collection('orders');

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const pid = item.id;
      const qty = parseInt(item.qty);
      const size = String(item.size || '').trim();

      if (!pid || !qty || qty <= 0 || qty > 20 || !size) {
        return res.status(400).json({ message: 'Un article du panier est invalide.' });
      }

      // Find product in MongoDB
      const query = ObjectId.isValid(pid) ? { $or: [{ _id: new ObjectId(pid) }, { numeric_id: Number(pid) }] } : { numeric_id: Number(pid) };
      const product = await productsCol.findOne(query);

      if (!product) {
        return res.status(400).json({ message: `Article introuvable dans le catalogue.` });
      }

      // Check stock
      const sizeObj = Array.isArray(product.sizes) ? product.sizes.find(s => String(s.size) === size) : null;
      if (!sizeObj || sizeObj.stock < qty) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}, pointure ${size}.` });
      }

      // Deduct stock in MongoDB
      await productsCol.updateOne(
        { _id: product._id, "sizes.size": size },
        { $inc: { "sizes.$.stock": -qty } }
      );

      const lineTotal = Number(product.price) * qty;
      total += lineTotal;
      orderItems.push({
        product_id: product.numeric_id || product._id.toString(),
        product_name: product.name,
        size,
        quantity: qty,
        unit_price: Number(product.price),
        line_total: lineTotal
      });
    }

    const deliveryFee = 300;
    total += deliveryFee;

    const orderNumber = 'CS-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const userId = req.user ? req.user.id : null;

    const orderDoc = {
      order_number: orderNumber,
      user_id: userId,
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      wilaya: wilaya.trim(),
      commune: commune.trim(),
      items: orderItems,
      delivery_fee: deliveryFee,
      total,
      payment_method: 'COD',
      status: 'pending',
      created_at: new Date()
    };

    const insertResult = await ordersCol.insertOne(orderDoc);

    console.log(`✓ Order placed: ${orderNumber} - ${customer_name} (${total} DA) saved in MongoDB`);

    res.status(201).json({
      success: true,
      order_id: insertResult.insertedId.toString(),
      order_number: orderNumber,
      customer_name,
      wilaya,
      commune,
      delivery_fee: deliveryFee,
      total
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de l’enregistrement de la commande.' });
  }
});

// Track Order by Order Number (Public)
router.get('/track/:orderNumber', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'MongoDB indisponible' });
    const ordersCol = db.collection('orders');
    const order = await ordersCol.findOne({ order_number: req.params.orderNumber });
    if (!order) return res.status(404).json({ message: 'Commande introuvable.' });

    res.json({
      order_number: order.order_number,
      customer_name: order.customer_name,
      wilaya: order.wilaya,
      commune: order.commune,
      status: order.status,
      total: order.total,
      delivery_fee: order.delivery_fee,
      items: order.items,
      created_at: order.created_at
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur de suivi.' });
  }
});

// Admin: Get all orders from MongoDB
router.get('/', requireAdmin, async (req, res) => {
  try {
    if (!db) return res.json(standaloneOrders);
    const ordersCol = db.collection('orders');
    const orders = await ordersCol.find().sort({ created_at: -1 }).toArray();

    const formatted = orders.map(o => ({
      id: o._id.toString(),
      order_number: o.order_number,
      customer_name: o.customer_name,
      customer_phone: o.phone,
      phone: o.phone,
      wilaya: o.wilaya,
      commune: o.commune,
      total: o.total,
      total_amount: o.total,
      delivery_fee: o.delivery_fee,
      status: o.status,
      items: o.items || [],
      created_at: o.created_at
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Erreur de récupération des commandes.' });
  }
});

// Admin: Update order status in MongoDB
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'MongoDB indisponible' });
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const ordersCol = db.collection('orders');
    const query = buildIdQuery(req.params.id);

    const updateResult = await ordersCol.updateOne(query, {
      $set: { status, updated_at: new Date() }
    });

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }

    res.json({ message: 'Statut mis à jour dans MongoDB avec succès.' });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
  }
});

export default router;
