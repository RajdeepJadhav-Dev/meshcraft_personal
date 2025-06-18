require('dotenv').config(); // Load env vars at the very top

const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const discordRoutes = require('./routes/discordRoutes');
const assetRoutes = require('./routes/assetRoutes');
const adminRoutes = require('./routes/adminRoutes');
const threeRoutes = require('./routes/threeRoutes');  
const thumbnailRoutes = require('./routes/thumbnailRoutes');
const steamRoutes = require('./routes/steamroutes'); // lowercase as per your rename

require('./SteamAuth'); // passport config for Steam

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // replace with env secret in prod
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to DB
connectDB();

// Routes
app.use('/auth/steam', steamRoutes);  // Steam routes mounted here
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/discord', discordRoutes);
app.use('/assets', assetRoutes);
app.use('/admin', adminRoutes);
app.use('/three', threeRoutes);
app.use('/thumbnail', thumbnailRoutes);

// CHANGED: Port from 5173 to 5000 to avoid conflict with Vite
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));