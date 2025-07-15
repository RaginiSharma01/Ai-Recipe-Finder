import axios from 'axios';

// Put your Spoonacular key in .env  (Vite reads VITE_* at build‑time)
const KEY = import.meta.env.VITE_SPOON_KEY;

/**
 * Search Spoonacular for recipes.
 * @param {{ ingredients:string, cuisine?:string, diet?:string }} filters
 * @returns {Promise<Array>}   array of recipe objects
 */
export async function searchRecipes({ ingredients, cuisine, diet }) {
  const endpoint = 'https://api.spoonacular.com/recipes/complexSearch';

  // Build query params
  const params = {
    apiKey: KEY,
    query: ingredients,
    cuisine,
    diet,
    number: 12,                // limit results
    addRecipeInformation: false
  };

  // Remove empty / undefined params
  Object.keys(params).forEach(k => params[k] == null && delete params[k]);

  const { data } = await axios.get(endpoint, { params });
  return data.results || [];
}
