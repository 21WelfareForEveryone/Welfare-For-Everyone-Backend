const express = require('express');
const welfareController = require('../controllers/welfareController');
const router = express.Router();

router.post("/rest/welfare/create", welfareController.createWelfare);
router.get("/rest/welfare/read", welfareController.readWelfare);
router.get("/rest/welfare/search", welfareController.searchWelfare);
router.get("/rest/welfare/recommend", welfareController.recommendedWelfare);
router.delete("/rest/welfare/delete", welfareController.deleteWelfare);

module.exports = router;