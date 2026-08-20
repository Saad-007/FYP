import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import searchRoutes from './routes/searchRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Professional Backend is running on port ${PORT}`);
});