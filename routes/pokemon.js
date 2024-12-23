const express = require('express');
const { getPokemons, getPokemonById, createPokemon, updatePokemon, deletePokemon, getPokemonsByTrainer, getPokemonsByType, getPokemonStatsByType, evolvePokemon } = require('../controllers/pokemonController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', getPokemons);
router.get('/:id', getPokemonById);
router.get('/trainer/mypokemons', auth, getPokemonsByTrainer);
router.post('/', auth, createPokemon);
router.put('/:id', auth, updatePokemon);
router.delete('/:id', auth, deletePokemon);
router.get('/type/:type', getPokemonsByType);
router.get('/stats/type', getPokemonStatsByType);
router.post('/evolve', auth, evolvePokemon);

module.exports = router;