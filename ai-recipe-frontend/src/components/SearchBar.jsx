import { useState } from 'react';

const CUISINES = ['', 'Indian', 'Italian', 'Mexican', 'Chinese', 'American', 'Thai','Korean', 'Japanese', 'French', 'Spanish', 'Mediterranean'];

const DIETS = [
  '', 'vegetarian', 'vegan', 'paleo', 'gluten free', 'ketogenic',
];

/*  helper: title‑case every word */
const titleCase = (str) =>
  str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const SearchBar = ({ onSearch }) => {
  const [form, setForm] = useState({
    ingredients: '',
    cuisine: '',
    diet: '',
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();

    /* build a clean payload */
    const payload = {
      ingredients: form.ingredients.trim(),
      cuisine: form.cuisine.trim().toLowerCase() || undefined,
      diet: form.diet.trim().toLowerCase() || undefined,
    };

    onSearch(payload);
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--gap)',
        marginBottom: '2rem',
        justifyContent: 'center',
      }}
    >
      <input
        name="ingredients"
        placeholder="Ingredients (comma‑separated)…"
        value={form.ingredients}
        onChange={handleChange}
        style={{ flex: '1 1 220px', minWidth: 0 }}
      />

      <select name="cuisine" value={form.cuisine} onChange={handleChange}>
        {CUISINES.map((c) => (
          <option key={c} value={c.toLowerCase()}>
            {c || 'Any cuisine'}
          </option>
        ))}
      </select>

      <select name="diet" value={form.diet} onChange={handleChange}>
        {DIETS.map((d) => (
          <option key={d} value={d}>
            {d ? titleCase(d) : 'Any diet'}
          </option>
        ))}
      </select>

      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
