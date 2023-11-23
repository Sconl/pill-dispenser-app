// routes/settings.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.get('/settings', async (req, res) => {
    // Fetch data from Firestore
    const userSettings = await getSettingsData('gkjq81JLsV9F8kcAeHpG');
    const userProfile = await getProfileData('X7Y9LeVsM6IfkXQV0LjI');

    res.render('settings', { userSettings, userProfile });
});

router.post('/settings/update', async (req, res) => {
    // Assuming you have a form with fields for both profile and settings
    const {
        name, age, gender, bloodType, allergies,
        dosage, medicine, set_time, theme
    } = req.body;

    // Update the user profile
    const updatedProfile = { name, age, gender, bloodType, allergies };
    await updateProfileData('X7Y9LeVsM6IfkXQV0LjI', updatedProfile);

    // Update the user settings
    const updatedSettings = { dosage, medicine, set_time, theme };
    await updateSettingsData('gkjq81JLsV9F8kcAeHpG', updatedSettings);

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
    const userRef = firestore.collection('users').doc(userId);
    const snapshot = await userRef.get();

    return snapshot.data();
}

// Function to update user profile data in Firestore
async function updateProfileData(userId, data) {
    const firestore = admin.firestore();
    const userRef = firestore.collection('users').doc(userId);

    await userRef.set(data, { merge: true });

    return true;
}

module.exports = router;
