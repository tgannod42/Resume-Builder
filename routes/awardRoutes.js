const express = require('express');
const { createAward, getAwardsByUser } = require('../controllers/awardController');

const objRouter = express.Router();

objRouter.get('/', getAwardsByUser);
objRouter.post('/', createAward);

module.exports = objRouter;
