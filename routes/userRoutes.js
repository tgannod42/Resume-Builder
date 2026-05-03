const express = require('express');
const { createOrGetUser, getUsers } = require('../controllers/userController');

const objRouter = express.Router();

objRouter.get('/', getUsers);
objRouter.post('/', createOrGetUser);

module.exports = objRouter;
