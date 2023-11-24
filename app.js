// Import required modules
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./_assets/christine-840a1-firebase-adminsdk-djrfl-6ef78469e1.json');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const crypto = require('crypto');
const auth = require('./routes/auth');


// Import route files
const settingsRoutes = require('./settings');
const profileRoutes = require('./profile');
const authRoutes = require('./routes/auth');

const app = express();

// Enable All CORS Requests
app.use(cors());

// Set the port for the server
const port = process.env.PORT || 3000;

// Create an HTTP server using Express
const server = http.createServer(app);

// Set up Socket.io for real-time updates
const io = socketIo(server);

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-4z2Gfzr0psGHBfTYnH-lk_vumhMlkgY",
  authDomain: "christine-840a1.firebaseapp.com",
  databaseURL: "https://christine-840a1-default-rtdb.firebaseio.com",
  projectId: "christine-840a1",
  storageBucket: "christine-840a1.appspot.com",
  messagingSenderId: "544139695224",
  appId: "1:544139695224:web:cc10cfae414c2fe634098d",
  measurementId: "G-YK3WJEXDNP"
};

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://christine-840a1-default-rtdb.firebaseio.com',
});

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files like CSS

// Session middleware with secret key generation
app.use(session({
  secret: generateSecretKey(),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // Use secure cookie in production (requires HTTPS)
}));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Default route renders 'layout.ejs'
app.get('/', (req, res) => {
  res.render('layout', { title: 'Your App Title' });
});

// Use routes
console.log('Using settingsRoutes...');
app.use('/settings', settingsRoutes);

console.log('Using profileRoutes...');
app.use('/profile', profileRoutes);

console.log('Using authRoutes...');
app.use('/auth', auth); // Use authentication routes

// Real-time updates with Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  // Example: Listen for real-time updates
  socket.on('update', (data) => {
    console.log('Real-time update received:', data);
    // You can send this data to the client or update the UI accordingly
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Function to generate a random secret key
function generateSecretKey() {
  return crypto.randomBytes(64).toString('hex');
}
