require('dotenv').config();

module.exports = {
  mongodb: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h' // Token validity
  },
  apis: {
    spoonacular: process.env.SPOONACULAR_KEY,
    openai: process.env.OPENAI_KEY
  }
};