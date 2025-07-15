const express = require('express');
const router  = express.Router();
const { generateRecipe } = require('../controllers/aiController'); // <- make sure path is correct

router.post('/recipe', generateRecipe);

module.exports = router;
