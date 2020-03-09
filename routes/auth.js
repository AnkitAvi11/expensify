const express = require('express');
const router = express.Router();
const userauth = require('../middlewares/userauth');
const authController = require('../controllers/auth');
const { body } = require('express-validator');

router.get('/login', userauth.isloggedin, authController.getLogin);

router.get('/signup', userauth.isloggedin, authController.getSignup);

router.post('/signup',
body('fname').isLength({min : 4}).withMessage('Enter a valid name'),
body('email').isEmail().withMessage('Enter a valid email address'),
body('pwd').isLength({min:12}).withMessage('Password must be 12 characters long'),
body('cpwd').custom((value, {req}) => {
    return value===req.body.pwd
}).withMessage("Password didn't match."),
authController.postSignup);

router.post('/login',
body('email').isEmail().withMessage("Enter a valid email address."),
body('pwd').isLength({min:1}).withMessage("Enter the password"),
authController.postLogin);

module.exports = router;