const Pokemon = require('../models/Pokemon');
const { check, validationResult } = require('express-validator');

exports.getPokemons = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const pokemons = await Pokemon.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Pokemon.countDocuments();
    res.json({
      pokemons,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPokemonById = async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) return res.status(404).json({ message: 'Pokemon not found' });
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPokemon = [
  check('name', 'Name is required').not().isEmpty(),
  check('type', 'Type is required').not().isEmpty(),
  check('level', 'Level must be a number').isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, level } = req.body;
    try {
      const pokemon = new Pokemon({ name, type, level, trainerId: req.user.userId });
      await pokemon.save();
      res.status(201).json(pokemon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];


exports.updatePokemon = [
  check('name', 'Name is required').optional().not().isEmpty(),
  check('type', 'Type is required').optional().not().isEmpty(),
  check('level', 'Level must be a number').optional().isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const pokemon = await Pokemon.findById(req.params.id);
      if (!pokemon) return res.status(404).json({ message: 'Pokemon not found' });

      if (pokemon.trainerId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { name, type, level } = req.body;
      pokemon.name = name || pokemon.name;
      pokemon.type = type || pokemon.type;
      pokemon.level = level || pokemon.level;
      await pokemon.save();
      res.json(pokemon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

exports.deletePokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) return res.status(404).json({ message: 'Pokemon not found' });

    if (pokemon.trainerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await pokemon.remove();
    res.json({ message: 'Pokemon deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPokemonsByTrainer = async (req, res) => {
  try {
    const pokemons = await Pokemon.find({ trainerId: req.user.userId });
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPokemonsByType = async (req, res) => {
  try {
    const pokemons = await Pokemon.find({ type: req.params.type });
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPokemonStatsByType = async (req, res) => {
  try {
    const stats = await Pokemon.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.evolvePokemon = async (req, res) => {
  const { evolvedFromId, name, type, level } = req.body;
  try {
    const evolvedFrom = await Pokemon.findById(evolvedFromId);
    if (!evolvedFrom) return res.status(404).json({ message: 'Original Pokemon not found' });

    if (evolvedFrom.trainerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const evolvedPokemon = new Pokemon({ name, type, level, trainerId: req.user.userId, evolvedFrom: evolvedFromId });
    await evolvedPokemon.save();
    res.status(201).json(evolvedPokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};