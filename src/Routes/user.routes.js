const express = require('express');
const userController = require('../controllers/UserController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/user', userController.createUser);
router.patch('/user', verifyToken, userController.updateUser);
router.delete('/user', verifyToken, userController.deleteUser);

module.exports = router;