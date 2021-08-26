const express = require('express');
const welfareController = require('../controllers/welfareController');
const router = express.Router();

router.post("/rest/welfare/create", welfareController.createWelfare);
router.get("/rest/welfare/read", welfareController.readWelfare);
router.delete("/rest/welfare/delete", welfareController.deleteWelfare);

module.exports = router;