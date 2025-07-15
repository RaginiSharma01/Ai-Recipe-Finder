import { useState } from 'react';
import SearchBar from './components/SearchBar';
import RecipeGrid from './components/RecipeGrid';

import { searchRecipes } from './api/spoonacular';
import { getRecipe } from './api/ai';

function App() {
  /* ---------- state ---------- */
  const [recipes, setRecipes]       = useState([]);
  const [loading, setLoading]       = useState(false);

  const [selected, setSelected]     = useState(null); // recipe object
  const [steps, setSteps]           = useState('');
  const [instrLoading, setILoading] = useState(false);

  /* ---------- search Spoonacular ---------- */
  const handleSearch = async (filters) => {
    setLoading(true);
    setSelected(null);
    setSteps('');
    try {
      const data = await searchRecipes(filters);      // array of recipe objects
      setRecipes(data);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- click card → call Hugging Face ---------- */
  const handleCardClick = async (recipe) => {
    setSelected(recipe);
    setSteps('');
    setILoading(true);
    try {
      const text = await getRecipe(recipe.title);     // string from LLM
      setSteps(text);
    } catch (err) {
      console.error(err);
      setSteps('Failed to generate instructions.');
    }
    setILoading(false);
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>🍳 AI Recipe Finder</h1>

      {/* --- filters --- */}
      <SearchBar onSearch={handleSearch} />

      {/* --- recipe grid or loader --- */}
      {loading ? (
        <p>Loading recipes…</p>
      ) : (
        <RecipeGrid recipes={recipes} onCardClick={handleCardClick} />
      )}

      {/* --- LLM instructions --- */}
      {selected && (
        <section style={{ marginTop: '2rem' }}>
          <h2>{selected.title}</h2>

          {instrLoading ? (
            <p>Generating recipe…</p>
          ) : (
          <pre
  style={{
    whiteSpace: 'pre-wrap',
    background: '#fafafa',
    padding: '1rem',
    borderRadius: 8,
    color: '#222',             // ✅ make text dark
    fontSize: '1rem',          // optional: improve readability
    lineHeight: '1.5',         // optional: better spacing
    fontFamily: 'monospace'    // optional: consistent code-style look
  }}
>
  {steps}
</pre>

          )}
        </section>
      )}
    </div>
  );
}

export default App;
