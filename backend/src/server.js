import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import brandRoutes from './routes/brands.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 1. Static Files: Vite Frontend Assets FIRST, then project assets & uploads
const frontendDist = path.join(__dirname, '../../frontend/dist');
const frontendDistAssets = path.join(frontendDist, 'assets');
const projectAssets = path.join(__dirname, '../../assets');
const uploadsDir = path.join(__dirname, '../uploads');

if (fs.existsSync(frontendDistAssets)) {
  app.use('/assets', express.static(frontendDistAssets, { maxAge: '1y', immutable: true }));
}
app.use('/assets', express.static(projectAssets));
app.use('/uploads', express.static(uploadsDir));

// 2. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/brands', brandRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'Chemsou Sneakers & Streetwear API',
    database: 'MongoDB (chemsou_store)',
    timestamp: new Date()
  });
});

// 3. Serve Frontend Root & SPA Fallback
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Site en cours de démarrage...');
  }
});

// 4. Start Server
if (!process.env.VERCEL) {
  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Chemsou Sneakers Store running on:`);
    console.log(`   - http://localhost:${PORT}`);
    console.log(`   - http://127.0.0.1:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}

export { app };
export default app;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
