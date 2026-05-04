/* AI USAGE COMMENT BLOCK
 * AI was used as a coding assistant for general application logic in this file.
 * It helped with drafting/refactoring code, naming cleanup, and basic validation/error-handling patterns.
 * A developer reviewed and finalized the implementation for project-specific behavior.
 */
const express = require('express');
const { createResponsibility, getResponsibilitiesByJob } = require('../controllers/responsibilityController');

const objRouter = express.Router();

objRouter.get('/', getResponsibilitiesByJob);
objRouter.post('/', createResponsibility);

module.exports = objRouter;
