const router = require('express').Router();
const authController = require('../controllers/authcontroller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authController.changePassword);

module.exports = router;