/* AI USAGE COMMENT BLOCK
 * AI was used as a coding assistant for general application logic in this file.
 * It helped with drafting/refactoring code, naming cleanup, and basic validation/error-handling patterns.
 * A developer reviewed and finalized the implementation for project-specific behavior.
 */
const express = require('express');
const { suggestResponsibility } = require('../controllers/aiController');

const objRouter = express.Router();

objRouter.post('/suggest', suggestResponsibility);

module.exports = objRouter;
