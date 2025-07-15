const express = require('express');
const axios = require('axios');
const router = express.Router();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

router.get('/search', async (req, res) => {
  try {
    const { ingredients, cuisine, diet } = req.query;

    // Validate at least one search parameter exists
    if (!ingredients && !cuisine && !diet) {
      return res.status(400).json({ 
        error: 'Please provide at least one search parameter (ingredients, cuisine, or diet)' 
      });
    }

    const params = {
      apiKey: SPOONACULAR_API_KEY,
      number: 10,
      ...(ingredients && { includeIngredients: ingredients }),
      ...(cuisine && { cuisine }),
      ...(diet && { diet }),
    };

    console.log('🔍 Spoonacular params →', params);

    const { data } = await axios.get(
      'https://api.spoonacular.com/recipes/complexSearch',
      { params }
    );

    // Handle potential variations in Spoonacular's response structure
    const results = data.results || data;
    res.json(results);
    
  } catch (err) {
    console.error('Recipe search error:', err.response?.data || err.message);
    
    const statusCode = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || 'Failed to fetch recipes from Spoonacular';
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: err.response?.data || null
    });
  }
});

module.exports = router;