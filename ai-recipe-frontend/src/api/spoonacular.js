import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Search recipes
 */
export async function searchRecipes({ ingredients, cuisine, diet }) {
  const params = { ingredients, cuisine, diet };
  const { data } = await axios.get(`${API_URL}/recipes`, { params });
  return data;
}

/**
 * Get recipe details
 */
export async function getRecipeDetails(id) {
  const { data } = await axios.get(`${API_URL}/recipes/${id}`);
  return data;
}
