require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Use MongoDB for Vercel/production, SQLite for local development
const useDatabase = process.env.NODE_ENV === 'production' || process.env.MONGODB_URI;
const db = useDatabase ? require('./database-mongo') : require('./database');

const routes = require('./routes');
const authRoutes = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Use MongoDB session store in production
if (useDatabase && process.env.MONGODB_URI) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  });
}

// Middleware
app.use(session(sessionConfig));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/auth.html');
  }
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', requireAuth, routes);

// Routes
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth.html', (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
  }
});

// Initialize database and start server
db.initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Database: ${useDatabase && process.env.MONGODB_URI ? 'MongoDB (Cloud)' : 'SQLite (Local)'}`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
