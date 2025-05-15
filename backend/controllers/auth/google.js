const passport = require("../../config/passport");

const google = passport.authenticate('google', { scope: ['profile', 'email'] });

module.exports = google;
