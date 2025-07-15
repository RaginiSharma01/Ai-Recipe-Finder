import { useState } from 'react';
import { searchRecipes } from './api/spoonacular'; // adjust path

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    try {
      const data = await searchRecipes({ ingredients: query, cuisine: '', diet: '' });
      setRecipes(data);
    } catch (e) {
      console.error('Search failed:', e.message || e);
    }
  };

  return (
    <div>
      <h1>Recipe Finder</h1>
      <input
        type="text"
        placeholder="Enter ingredients"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div className="grid">
        {recipes.map((r) => (
          <div key={r.id} className="card">
            <img src={r.image} alt={r.title} className="thumb" />
            <h3>{r.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
