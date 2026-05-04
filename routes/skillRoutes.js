const express = require('express');
const { createSkill, getSkillsByUser } = require('../controllers/skillController');

const objRouter = express.Router();

objRouter.get('/', getSkillsByUser);
objRouter.post('/', createSkill);

module.exports = objRouter;
