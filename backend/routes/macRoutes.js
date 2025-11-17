const express = require('express');
const router = express.Router();
const macController = require('../controllers/macController');
const { validateMac } = require('../validators/macValidator');

router.post('/', validateMac, macController.createMac);

module.exports = router;