import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import db from '../db.js';
import { JWT_SECRET, authenticate } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const name = (req.body.name || req.body.full_name || '').trim();
    const { email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nom, e-mail et mot de passe requis.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit comporter au moins 6 caractères.' });
    }

    const emailClean = email.toLowerCase().trim();

    if (!db) {
      if ((emailClean === 'winnerdz000@gmail.com' && password === 'yacine123') ||
          (emailClean === 'admin@gmail.com' && password === 'admin123')) {
        const token = jwt.sign(
          { id: 'admin-standalone-1', email: emailClean, name: 'Chemsou Admin (Yacine)', role: 'admin' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          user: { id: 'admin-standalone-1', name: 'Chemsou Admin (Yacine)', email: emailClean, phone: '0540755098', role: 'admin' },
          token
        });
      }
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const usersCol = db.collection('users');

    // Check existing
    const existing = await usersCol.findOne({ email: emailClean });
    if (existing) {
      return res.status(400).json({ message: 'Cet e-mail est déjà utilisé.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await usersCol.insertOne({
      name,
      email: emailClean,
      phone: phone?.trim() || null,
      password_hash: passwordHash,
      role: 'customer',
      created_at: new Date()
    });

    const userId = result.insertedId.toString();
    const token = jwt.sign({ id: userId, email: emailClean, name, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: { id: userId, name, email: emailClean, phone, role: 'customer' },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Erreur lors de l’inscription.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail et mot de passe requis.' });
    }

    const emailClean = email.toLowerCase().trim();

    if (!db) {
      if ((emailClean === 'winnerdz000@gmail.com' && password === 'yacine123') ||
          (emailClean === 'admin@gmail.com' && password === 'admin123')) {
        const token = jwt.sign(
          { id: 'admin-standalone-1', email: emailClean, name: 'Chemsou Admin (Yacine)', role: 'admin' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          user: { id: 'admin-standalone-1', name: 'Chemsou Admin (Yacine)', email: emailClean, phone: '0540755098', role: 'admin' },
          token
        });
      }
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const usersCol = db.collection('users');
    const user = await usersCol.findOne({ email: emailClean });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const userId = user._id ? user._id.toString() : String(user.numeric_id);
    const token = jwt.sign(
      { id: userId, email: user.email, name: user.name, role: user.role || 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: { id: userId, name: user.name, email: user.email, phone: user.phone, role: user.role || 'customer' },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Erreur de connexion.' });
  }
});

// Current User Profile & Orders
router.get('/me', authenticate, async (req, res) => {
  try {
    if (!db) return res.json({ user: req.user, orders: [] });

    const usersCol = db.collection('users');
    let user = null;
    try {
      if (ObjectId.isValid(req.user.id)) {
        user = await usersCol.findOne({ _id: new ObjectId(req.user.id) });
      }
    } catch (e) {}

    if (!user) {
      user = await usersCol.findOne({ email: req.user.email });
    }

    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });

    // Fetch user orders from MongoDB
    const ordersCol = db.collection('orders');
    const userOrders = await ordersCol.find({
      $or: [
        { user_id: req.user.id },
        { customer_email: req.user.email },
        { user_email: req.user.email }
      ]
    }).sort({ created_at: -1 }).toArray();

    res.json({
      user: {
        id: user._id ? user._id.toString() : user.numeric_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      orders: userOrders
    });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

export default router;
