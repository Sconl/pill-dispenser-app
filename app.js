// app.js
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./_assets/christine-840a1-firebase-adminsdk-djrfl-6ef78469e1.json');

const app = express();
const port = 3000;

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://christine-840a1-default-rtdb.firebaseio.com', // Replace with your project's database URL
});

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Import route files
const settingsRoutes = require('./settings');
const profileRoutes = require('./profile'); // Import the profile routes

// Use routes
app.use('/', settingsRoutes);
app.use('/profile', profileRoutes); // Use the profile routes

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
