const express = require('express');
const { createProfile, getUsers } = require('../controllers/userController');

const objRouter = express.Router();

objRouter.get('/', getUsers);
objRouter.post('/profile', createProfile);

module.exports = objRouter;
