// app.js
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./_assets/christine-840a1-firebase-adminsdk-djrfl-6ef78469e1.json');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server);

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://christine-840a1-default-rtdb.firebaseio.com',
});

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Import route files
const settingsRoutes = require('./settings');
const profileRoutes = require('./profile');

// Use routes
app.use('/', settingsRoutes);
app.use('/profile', profileRoutes);

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

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
