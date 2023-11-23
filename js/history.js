const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Placeholder for user history data
let userHistory = [
    { date: '2023-01-01', event: 'Visited homepage' },
    // Add other history entries as needed
];

router.get('/history', async (req, res) => {
    // Fetch data from Firestore
    const firestoreData = await getFirestoreData();

    res.render('history', { userHistory, firestoreData });
});

// Function to get data from Firestore
async function getFirestoreData() {
    const firestore = admin.firestore();
    const historyRef = firestore.collection('history');
    const snapshot = await historyRef.get();

    const firestoreData = [];
    snapshot.forEach(doc => {
        firestoreData.push(doc.data());
    });

    return firestoreData;
}

module.exports = router;
