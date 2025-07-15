const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

module.exports ={

  searchRecipes : async (ingredients , filters ={}) => {
    const params = {
      ingredients : ingredients.json (','),
      apiKey : API_KEY,
      number : 10,
      ...filters
    };

    try{
      const { data } = await axios.get(`${BASE_URL}/findByIngredients`, { params });
      return data.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        usedIngredients: recipe.usedIngredients,
        missedIngredients: recipe.missedIngredients
      }));

    }catch(error){
       console.error('Spoonacular error:', error.response?.data || error.message);
      throw new Error('Failed to fetch recipes');

    }
  },

  getRecipeDetails: async (recipeId) => {
    const { data } = await axios.get(`${BASE_URL}/${recipeId}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true
      }
    });
    
    return {
      ...data,
      nutrition: data.nutrition.nutrients // Simplify response
    };
  }
};