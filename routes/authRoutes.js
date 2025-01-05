const router = require('express').Router();
const authController = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;