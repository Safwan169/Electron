const passport = require('passport');
const User = require('../models/schema/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken'); // Make sure to install this
const dotenv=require('dotenv')
dotenv.config()
// Your JWT secret key
const JWT_SECRET = 'your-jwt-secret'; // Store this in an environment variable in production

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true // This allows us to access the request object in the callback
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile, profile.emails[0].value, 'this is the profile');
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await User.create({
        userName: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
        provider: 'google',
       
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );
    
    // Store the token on the request object to access it in the callback route
    req.authToken = token;
    
    console.log(user, 'this is the user');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

// Serialization is still needed for Passport's internal functioning
passport.serializeUser((user, done) => {
  done(null, user.id); // Use user.id instead of email for consistency
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Use findById instead of email
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;