import { useState } from 'react';
import axios from 'axios';
import RecipeGrid from '../components/RecipeGrid';

const Home = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/recipes/search`,
        {
          params: { ingredients },
        }
      );
      setRecipes(data);
    } catch (err) {
      console.error(err);
      alert('Something went wrong while fetching recipes!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🍳 AI Recipe Finder</h2>
      <input
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="e.g. tomato, onion, garlic"
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <button onClick={handleSearch} style={{ marginLeft: '1rem' }}>
        Search
      </button>
      {recipes.length > 0 && (
  <RecipeGrid recipes={recipes} />
)}

      {loading && <p>Loading recipes...</p>}

      <ul style={{ marginTop: '2rem' }}>
        {recipes.map((recipe, index) => (
          <li key={recipe.id || index}>
            <strong>{recipe.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
