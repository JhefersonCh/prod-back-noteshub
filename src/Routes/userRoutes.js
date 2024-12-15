const express = require('express');
const UserController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/user', UserController.createUser);
router.patch('/user', [verifyToken], UserController.updateUser);
router.delete('/user', [verifyToken], UserController.deleteUser);

module.exports = router;