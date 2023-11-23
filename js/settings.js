// routes/settings.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.get('/settings', async (req, res) => {
    // Fetch user settings data from Firestore
    const userSettings = await getSettingsData('gkjq81JLsV9F8kcAeHpG');

    res.render('settings', { userSettings });
});

router.post('/settings/update', async (req, res) => {
    // Assuming you have a form with fields for settings
    const { dosage, medicine, set_time } = req.body;

    // Update the user settings in Firestore
    await updateSettingsData('gkjq81JLsV9F8kcAeHpG', { dosage, medicine, set_time });

    // Emit real-time update to all connected clients
    io.emit('settingsUpdate', { dosage, medicine, set_time });

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

module.exports = router;
