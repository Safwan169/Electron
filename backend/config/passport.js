const passport = require('passport');
const User = require('../models/shema/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
  clientID: '439449465679-58su86cshql3ujl8pcf3v6eh5mphlm75.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile,'this is the profiel')
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        userName: profile.displayName,
        email: profile.emails[0].value,
      });
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

module.exports = passport;
