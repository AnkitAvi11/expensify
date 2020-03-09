const {validationResult} = require('express-validator');
const ExpenseModel = require('../models/Expense');

module.exports.getAddExpense = (req, res, next) => {
    res.render("./users/addexpense", {
        title : 'Add Expense',
        path : '/add',
        css : [],
        js : [],
        success : req.flash('success'),
        error : req.flash('error')
    });
}

module.exports.postAddExpense = (req, res, next) => {
    let error = validationResult(req);
    if(error.isEmpty()) {

        const expense = new ExpenseModel({
            user_id : req.session.user.user_id,
            title : req.body.title,
            desc : req.body.desc,
            amount : req.body.amount,
            type : req.body.type,
            date: req.body.date
        });

        expense.save()
        .then(([result, field]) => {
            req.flash('success', "Added Sucessfully.");
            req.session.save(() => {
                res.redirect("/profile/add");
            });
        }).catch(err => {
            return res.send(err);
        });

    }else{
        req.flash('error', error.errors[0].msg);
        req.session.save(() => {
            res.redirect("/profile/add");
        });
    }
}

//  API
module.exports.getExpense = (req, res, next) => {
    if(req.session.loggedin) {
        ExpenseModel.getById(req.session.user.user_id, req.body.id)
        .then(([result, fields]) => {
            res.send(result);
        }).catch(err => {
            res.send(err);
        })
    }else{
        res.send({error:500, msg : "You need to be fucking logged in." });
    }
};
