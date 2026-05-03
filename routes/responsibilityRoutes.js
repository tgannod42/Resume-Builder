const express = require('express');
const { createResponsibility, getResponsibilitiesByJob } = require('../controllers/responsibilityController');

const objRouter = express.Router();

objRouter.get('/', getResponsibilitiesByJob);
objRouter.post('/', createResponsibility);

module.exports = objRouter;
