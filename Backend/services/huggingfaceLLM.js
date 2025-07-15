const axios = require('axios');
require('dotenv').config();

class HuggingFaceService {
  static async generateRecipe(prompt) {
    try {
      // Calling Hugging Face Inference API
      const response = await axios.post(
        process.env.HF_MODEL_URL || 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
        { inputs: prompt },
        { 
          headers: { 
            'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30-second timeout
        }
      );
      
      return response.data[0].generated_text;
    } catch (error) {
      console.error('Hugging Face Error:', error.response?.data || error.message);
      throw new Error('Failed to generate recipe');
    }
  }
}

module.exports = HuggingFaceService;