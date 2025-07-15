import axios from 'axios';

// If you proxy /api in vite.config.js you can shorten this to "".
const BASE = 'http://localhost:5000/api/ai';

/**
 * Ask the backend LLM route for a full recipe text.
 * @param {string} title  Dish name, e.g. "butter paneer masala"
 * @returns {string}      Recipe markdown / plain‑text
 */
export const getRecipe = async (title) => {
  const { data } = await axios.post(`${BASE}/recipe`, { title });
  return data.recipe;                 // backend returns { success, recipe }
};
