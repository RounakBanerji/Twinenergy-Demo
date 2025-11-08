import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import timing from './middleware/timing.js';
import energyRoutes from './routes/energyRoutes.js';
import './db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(timing);

app.use('/api', energyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
