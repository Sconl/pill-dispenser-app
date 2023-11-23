// routes/auth.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const session = require('express-session');

router.use(bodyParser.urlencoded({ extended: true }));

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Sign-up route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    console.log('Successfully created new user:', userRecord.uid);

    req.session.user = {
      uid: userRecord.uid,
      email: userRecord.email,
    };

    res.redirect('/profile');
  } catch (error) {
    console.error('Error creating new user:', error);
    res.redirect('/signup'); // Handle errors appropriately
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);

    // TODO: Implement password validation
    // For simplicity, the validation is not included in this example

    req.session.user = {
      uid: userRecord.uid,
      email: userRecord.email,
    };

    res.redirect('/profile');
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.redirect('/login'); // Handle errors appropriately
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

module.exports = {
  router,
  isAuthenticated,
};
