// routes/profile.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.get('/profile', async (req, res) => {
    // Fetch user profile data from Firestore
    const userProfile = await getProfileData('X7Y9LeVsM6IfkXQV0LjI');

    res.render('profile', { userProfile });
});

// Function to get user profile data from Firestore
async function getProfileData(userId) {
    const firestore = admin.firestore();
    const userRef = firestore.collection('users').doc(userId);
    const snapshot = await userRef.get();

    return snapshot.data();
}

module.exports = router;
