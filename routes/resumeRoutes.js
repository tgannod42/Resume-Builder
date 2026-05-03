const express = require('express');
const { createResume, getResumesByUser } = require('../controllers/resumeController');

const objRouter = express.Router();

objRouter.get('/', getResumesByUser);
objRouter.post('/', createResume);

module.exports = objRouter;
