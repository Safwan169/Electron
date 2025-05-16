const express =require('express')
const login = require('./login')
const register = require('./register')
const  google  = require('./google')
const router=express.Router()
router.post('/login',login)

const passport=require('passport')

router.post('/register',register)
router.get('/google', google.googleAuth );
// In your routes file:
router.get('/google/callback', 
  passport.authenticate('google', { session: false }), // Disable sessions
  (req, res) => {
    // Set the JWT token as a cookie
    res.cookie('token', req.authToken, {
      httpOnly: true, // Prevents JavaScript access to cookie
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });
    
    // Redirect to your frontend
    res.redirect('http://localhost:3000');
  }
);

module.exports = router