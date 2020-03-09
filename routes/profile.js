const express = require('express');
const auth = require('../middlewares/userauth');
const profileController = require('../controllers/profile');
const {body} = require('express-validator');

const router = express.Router();

router.get("/add", auth.isAuth, profileController.getAddExpense);

router.post('/add',
body('title').isLength({min:5}).withMessage("Enter a valid title"),
body('amount').isNumeric().withMessage("Enter a valid amount"),
body('date').isLength({min:8}).withMessage("Enter a valid date"),
profileController.postAddExpense);

router.post("/expense", profileController.getExpense);

module.exports = router;