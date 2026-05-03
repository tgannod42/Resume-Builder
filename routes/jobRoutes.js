const express = require('express');
const { createJob, getJobsByUser } = require('../controllers/jobController');

const objRouter = express.Router();

objRouter.get('/', getJobsByUser);
objRouter.post('/', createJob);

module.exports = objRouter;
