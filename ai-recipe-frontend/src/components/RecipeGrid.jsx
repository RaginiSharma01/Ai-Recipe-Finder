import RecipeCard from './RecipeCard';
import '../styles/RecipeGrid.css';           // keep your grid styles

const RecipeGrid = ({ recipes, onCardClick }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '1rem'
    }}
  >
    {recipes.map((r, i) => (
      <RecipeCard key={r.id || i} recipe={r} onClick={onCardClick} />
    ))}
  </div>
);

export default RecipeGrid;
