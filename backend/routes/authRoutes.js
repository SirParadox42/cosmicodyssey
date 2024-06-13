const express = require('express');
const {check} = require('express-validator');
const authControllers = require('../controllers/authControllers');
const fileUpload = require('../middleware/fileUpload');

const router = express.Router();

router.post('/signup', fileUpload.single('image'), [check('username').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({min: 7})], authControllers.signup);
router.post('/login', authControllers.login);

module.exports = router;