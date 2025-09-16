const express = require('express');
const { searchRecipes, getRecipeDetails } = require('../services/spoonacular');
const router = express.Router();

// GET /api/recipes?ingredients=apple,tomato
router.get('/', async (req, res) => {
  try {
    const { ingredients, ...filters } = req.query;
    const recipes = await searchRecipes(ingredients, filters);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const recipe = await getRecipeDetails(req.params.id);
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
