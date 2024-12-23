const mongoose = require('mongoose');

/**
* @modelo basico para el usuario
*/

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'trainer' }
});

module.exports = mongoose.model('User', UserSchema);