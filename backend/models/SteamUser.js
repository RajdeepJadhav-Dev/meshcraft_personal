const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  openId: String,
  steamId: String,
  displayName: String,
  profile: Object
});

module.exports = mongoose.model('SteamUser', UserSchema);
