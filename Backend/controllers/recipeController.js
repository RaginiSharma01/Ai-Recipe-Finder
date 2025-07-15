// controllers/recipeController.js
const axios = require('axios');

const searchRecipes = async (req, res) => {
  try {
    const { ingredients, cuisine, diet } = req.query;

    // 1. First try Spoonacular API
    const spoonacularResponse = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        includeIngredients: ingredients,
        cuisine,
        diet,
        number: 5,
        apiKey: process.env.SPOONACULAR_API_KEY,
      },
      timeout: 5000 // 5-second timeout
    });

    if (spoonacularResponse.data.results.length > 0) {
      return res.json(spoonacularResponse.data.results);
    }

    // 2. Fallback to Hugging Face LLM if no results
    const prompt = `
      Generate a ${cuisine || ''} ${diet || ''} recipe using: ${ingredients}.
      Respond in JSON format with:
      {
        "title": "Recipe name",
        "ingredients": ["item1", "item2"],
        "instructions": ["step1", "step2"],
        "cookingTime": "X mins"
      }
    `;

    const hfResponse = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      { inputs: prompt },
      {
        headers: { 'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}` },
        timeout: 15000 // 15-second timeout
      }
    );

    // Parse AI response (with fallback to raw text if JSON fails)
    try {
      const recipe = JSON.parse(hfResponse.data[0].generated_text);
      return res.json([recipe]); // Return as array to match Spoonacular's format
    } catch {
      return res.json([{ 
        title: "AI-Generated Recipe",
        instructions: hfResponse.data[0].generated_text 
      }]);
    }

  } catch (error) {
    console.error('Recipe search error:', error.message);
    
    // 3. Final fallback to TheMealDB if everything fails
    if (error.response?.status === 402 || error.code === 'ECONNABORTED') {
      try {
        const mealDbResponse = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`,
          { timeout: 3000 }
        );
        return res.json(mealDbResponse.data.meals || []);
      } catch (fallbackError) {
        console.error('Fallback API error:', fallbackError.message);
      }
    }

    res.status(500).json({ 
      error: 'Failed to fetch recipes',
      details: error.message 
    });
  }
};

module.exports = { searchRecipes };