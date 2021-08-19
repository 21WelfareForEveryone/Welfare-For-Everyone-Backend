const express = require('express');
const router = express.Router();
const dibsController = require('../controllers/dibsController');

router.post('/rest/dibs/add', dibsController.createDib);

module.exports = router;