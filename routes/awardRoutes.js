/* AI USAGE COMMENT BLOCK
 * AI was used as a coding assistant for general application logic in this file.
 * It helped with drafting/refactoring code, naming cleanup, and basic validation/error-handling patterns.
 * A developer reviewed and finalized the implementation for project-specific behavior.
 */
const express = require('express');
const { createAward, getAwardsByUser } = require('../controllers/awardController');

const objRouter = express.Router();

objRouter.get('/', getAwardsByUser);
objRouter.post('/', createAward);

module.exports = objRouter;
