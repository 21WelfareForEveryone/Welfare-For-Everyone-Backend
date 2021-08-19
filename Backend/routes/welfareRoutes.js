const express = require('express');
const welfareController = require('../controllers/welfareController');
const router = express.Router();

router.get("/rest/welfare/read", welfareController.readWelfare);
router.get("/rest/welfare/dibs", welfareController.readDibsWelfare);

module.exports = router;