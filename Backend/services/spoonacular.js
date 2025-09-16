const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

module.exports = {
  // Search recipes by ingredients
  searchRecipes: async (ingredients, filters = {}) => {
    const ingredientsString = Array.isArray(ingredients)
      ? ingredients.join(',')
      : ingredients;

    const params = {
      ingredients: ingredientsString,
      apiKey: API_KEY,
      number: 10,
      ranking: 1,
      ignorePantry: true,
      ...filters
    };

    try {
      const { data } = await axios.get(`${BASE_URL}/findByIngredients`, { params });

      return data.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        usedIngredients: recipe.usedIngredients?.map(ing => ing.name) || [],
        missedIngredients: recipe.missedIngredients?.map(ing => ing.name) || [],
      }));
    } catch (error) {
      console.error('Spoonacular search error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
      throw new Error('Failed to fetch recipes');
    }
  },

  // Get details of a recipe
  getRecipeDetails: async (recipeId) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/${recipeId}/information`, {
        params: { apiKey: API_KEY, includeNutrition: true }
      });

      return {
        id: data.id,
        title: data.title,
        image: data.image,
        readyInMinutes: data.readyInMinutes,
        servings: data.servings,
        summary: data.summary,
        instructions: data.instructions,
        extendedIngredients: data.extendedIngredients?.map(ing => ({
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          original: ing.original
        })) || [],
        nutrition: data.nutrition?.nutrients || []
      };
    } catch (error) {
      console.error('Recipe details error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
      throw new Error('Failed to get recipe details');
    }
  }
};
