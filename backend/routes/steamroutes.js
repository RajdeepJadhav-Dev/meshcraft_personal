const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Steam authentication
router.get('/', passport.authenticate('steam'));

// Steam callback after login
router.get('/return',
  passport.authenticate('steam', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/profile`); // redirect to frontend profile page
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
