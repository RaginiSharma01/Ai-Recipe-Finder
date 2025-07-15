const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

module.exports = {
  /**
   * Hash password with salt
   * @param {String} plainPassword 
   */
  hashPassword: async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainPassword, salt);
  },

  /**
   * Generate JWT token
   * @param {String} userId 
   */
  generateToken: (userId) => {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  /**
   * Verify password match
   * @param {String} inputPassword 
   * @param {String} hashedPassword 
   */
  comparePasswords: async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }
};