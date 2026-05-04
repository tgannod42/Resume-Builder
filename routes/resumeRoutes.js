const express = require('express');
const { createResume, getResumesByUser, exportResume } = require('../controllers/resumeController');

const objRouter = express.Router();

objRouter.get('/', getResumesByUser);
objRouter.post('/', createResume);
objRouter.get('/export', exportResume);

module.exports = objRouter;
