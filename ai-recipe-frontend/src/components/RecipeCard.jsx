import noPhoto from '../assets/no-photo.jpg';

const getImageUrl = (r) =>
  r.image ||
  (r.id && r.imageType
    ? `https://img.spoonacular.com/recipes/${r.id}-312x231.${r.imageType}`
    : noPhoto);

const RecipeCard = ({ recipe, onClick }) => (
  <div className="card" onClick={() => onClick(recipe)}>
    <img
      src={getImageUrl(recipe)}
      alt={recipe.title}
      className="thumb"
      referrerPolicy="no-referrer"
      onError={(e) => { e.currentTarget.src = noPhoto; }}
    />
    <h3>{recipe.title}</h3>
  </div>
);

export default RecipeCard;
