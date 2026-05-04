const express = require('express');
const { createCertification, getCertificationsByUser } = require('../controllers/certificationController');

const objRouter = express.Router();

objRouter.get('/', getCertificationsByUser);
objRouter.post('/', createCertification);

module.exports = objRouter;
