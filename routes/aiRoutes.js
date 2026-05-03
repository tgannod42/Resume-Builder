const express = require('express');
const { suggestResponsibility } = require('../controllers/aiController');

const objRouter = express.Router();

objRouter.post('/suggest', suggestResponsibility);

module.exports = objRouter;
