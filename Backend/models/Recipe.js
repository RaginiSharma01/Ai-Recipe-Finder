const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  spoonacularId: {
    type: Number,
    unique: true,
    sparse: true // For user-created recipes that won't have this ID
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: '/images/default-recipe.jpg'
  },
  summary: {
    type: String,
    trim: true
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: Number,
    unit: String,
    original: String // Store the original string from API if needed
  }],
  instructions: [{
    step: Number,
    text: {
      type: String,
      required: true
    }
  }],
  readyInMinutes: {
    type: Number
  },
  servings: {
    type: Number,
    default: 2
  },
  diets: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'keto', 'lactose-free']
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.spoonacularId; // Required only for user-created recipes
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for search optimization
RecipeSchema.index({ title: 'text', 'ingredients.name': 'text' });

// Virtual for favorite count (how many users have this in favorites)
RecipeSchema.virtual('favoriteCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'favorites',
  count: true
});

module.exports = mongoose.model('Recipe', RecipeSchema);