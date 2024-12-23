const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: Number, required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  evolvedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon' }
});

module.exports = mongoose.model('Pokemon', PokemonSchema);