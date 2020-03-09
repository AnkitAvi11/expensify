const express = require('express');
const router = express.Router();
const ExpenseModel = require('../models/Expense');

router.get("/", async(req, res, next) => {
    //  if the user has loggedin
    if(req.session.loggedin) {
        
        try{

            let data = await ExpenseModel.getPresentDayExpense(req.session.user.user_id)
            .then(([result, field]) => {
                return result;
            });

            let total = await ExpenseModel.totalExpense(req.session.user.user_id).then(([result, fields]) => result);
            
            res.render('./users/home', {
                title : "Home",
                css : [],
                js : ['main.js'],
                path : "/",
                data : data,
                total : total[0].total
            });

        }catch(err) {
            throw err;
        }
    } else {
        //  if the user hasn't logged in 
        res.render('landing', {
            title : "Expensify : Home",
            path : "/",
            css : [],
            js : []
        });
    }
});

router.get("/about", (req, res, next) => {
    res.render("about", {
        title:"About",
        css : [],
        js : [],
        path : "/about"
    });
});

router.post('/logout', (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;