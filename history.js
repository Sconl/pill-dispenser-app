const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.get('/history', async (req, res) => {
    // Placeholder for user history data
    let userHistory = [
        { time: '12:00 PM', dosage: '1 pill', medicine: 'Medicine A' },
        { time: '03:30 PM', dosage: '2 pills', medicine: 'Medicine B' },
        // Add other user history entries as needed
    ];

    // Fetch data from Firestore
    const firestoreData = await getFirestoreData();

    res.render('history', { history: userHistory, firestoreData });
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
