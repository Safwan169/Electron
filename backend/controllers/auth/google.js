const passport = require("../../config/passport");

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const redirect=passport.authenticate('google', { 
    failureRedirect: '/login',
    successRedirect: 'http://localhost:3000' 
  })

module.exports = {googleAuth,redirect};
