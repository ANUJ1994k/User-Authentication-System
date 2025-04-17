const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const allowedOrigins = ['https://user-authentication-system-navy.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // if using cookies or auth headers
}));

app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
