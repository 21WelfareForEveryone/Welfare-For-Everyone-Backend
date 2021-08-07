const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/rest/user/login', userController.userLogin);
router.post('/rest/user/register', userController.userRegister);
router.put('/rest/user/update', userController.userUpdate);
router.delete('/rest/user/delete', userController.userDelete);

module.exports = router;