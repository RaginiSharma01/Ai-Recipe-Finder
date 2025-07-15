require('dotenv').config();
const { InferenceClient } = require('@huggingface/inference');

const CLIENT = new InferenceClient(process.env.HUGGING_FACE_API_KEY);
const MODEL  = 'mistralai/Mistral-7B-Instruct-v0.2';

/**
 * POST /api/ai/recipe
 * Body: { "title": "butter paneer masala" }
 */
async function generateRecipe(req, res) {
  const { title } = req.body;
  if (!title || typeof title !== 'string')
    return res.status(400).json({ error: 'Missing or invalid "title"' });

  try {
    const chat = await CLIENT.chatCompletion({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful culinary assistant.' },
        { role: 'user',   content: `Generate a detailed recipe for ${title}. Include ingredients with quantities and step‑by‑step instructions.` }
      ],
      max_tokens: 1024,
      temperature: 0.7
    });

    const recipeText = chat.choices?.[0]?.message?.content ?? '';
    return res.json({ success: true, recipe: recipeText });

  } catch (err) {
    console.error('HF chatCompletion error:', err);
    return res.status(err.response?.status || 500).json({
      success: false,
      error: 'Failed to generate recipe',
      details: err.response?.data?.error || err.message
    });
  }
}

module.exports = { generateRecipe };   // <= the only export
