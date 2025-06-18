const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const SteamUser = require('./models/SteamUser'); // Your Steam user model

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  SteamUser.findById(id, (err, user) => done(err, user));
});

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:5000/auth/steam/return', // <-- backend
    realm: 'http://localhost:5000/',                      // <-- backend
    apiKey: 'FABC996695151AAC8E0E082D8D1C4E66'
  },
  async (identifier, profile, done) => {
    try {
      let user = await SteamUser.findOne({ openId: identifier });
      if (!user) {
        // Create new user if not found
        user = new SteamUser({
          openId: identifier,
          steamId: profile.id,
          displayName: profile.displayName,
          profile: profile._json
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

module.exports = passport;
