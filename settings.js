// routes/settings.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const io = require('socket.io')(); // Import socket.io instance

router.get('/settings', async (req, res) => {
    // Fetch user settings data from Firestore
    const userSettings = await getSettingsData('gkjq81JLsV9F8kcAeHpG');
    // Fetch user profile data from Firestore
    const userProfile = await getProfileData('X7Y9LeVsM6IfkXQV0LjI');

    res.render('settings', { userSettings, userProfile });
});

router.post('/settings/update', async (req, res) => {
    // Assuming you have a form with fields for settings
    const { dosage, medicine, set_time, time_interval } = req.body;

    // Update the user settings in Firestore
    await updateSettingsData('gkjq81JLsV9F8kcAeHpG', { dosage, medicine, set_time, time_interval });

    // Emit real-time update to all connected clients for settings
    io.emit('settingsUpdate', { dosage, medicine, set_time, time_interval });

    // Redirect back to the settings page
    res.redirect('/settings');
});

router.post('/profile/update', async (req, res) => {
    // Assuming you have a form with fields for profile
    const { name, age, gender } = req.body;

    // Update the user profile in Firestore
    await updateProfileData('X7Y9LeVsM6IfkXQV0LjI', { name, age, gender });
    
    // Emit real-time update to all connected clients for profile
    io.emit('profileUpdate', { name, age, gender });

    // Redirect back to the settings page
    res.redirect('/settings');
});

// Function to get user settings data from Firestore
async function getSettingsData(userId) {
    const firestore = admin.firestore();
    const settingsRef = firestore.collection('settings').doc(userId);
    const snapshot = await settingsRef.get();

    return snapshot.data();
}

// Function to update user settings data in Firestore
async function updateSettingsData(userId, data) {
    const firestore = admin.firestore();
    const settingsRef = firestore.collection('settings').doc(userId);

    await settingsRef.set(data, { merge: true });

    return true;
}

// Function to get user profile data from Firestore
async function getProfileData(userId) {
    const firestore = admin.firestore();
    const profileRef = firestore.collection('users').doc(userId);
    const snapshot = await profileRef.get();

    return snapshot.data();
}

// Function to update user profile data in Firestore
async function updateProfileData(userId, data) {
    const firestore = admin.firestore();
    const profileRef = firestore.collection('users').doc(userId);

    await profileRef.set(data, { merge: true });

    return true;
}

module.exports = router;
