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

//  APIS 

//  for getting expense
module.exports.getExpense = (req, res, next) => {
    if(req.session.loggedin) {
        ExpenseModel.getById(req.session.user.user_id, req.body.id)
        .then(([result, fields]) => {
            res.send(result);
        }).catch(err => {
            res.send(err);
        });
    }else{
        res.send({error:500, msg : "You need to be fucking logged in." });
    }
};

//  for getting doughnat
module.exports.getdoughnat = async (req, res, next) => {
    if(req.session.loggedin) {
        let expenses = await ExpenseModel.getTotalExpenses(req.session.user.user_id);
        let income = await ExpenseModel.getTotalIncome(req.session.user.user_id);
        return res.send({expense : [expenses[0][0].total, income[0][0].total]})
    }
    return res.send(JSON.stringify({error_code : 505, msg : "You are not loggedin, you dumbass!"}))
}


//  for getting home bar graph
module.exports.homeBarGraph = (req, res, next) => {
    let date = new Date();
    let lastdate = new Date();
    lastdate.setDate(date.getDate()-7+1);
    current_date = date.toLocaleDateString();
    last_date = lastdate.toLocaleDateString();

    ExpenseModel.getWeeklyTransaction(req.session.user.user_id,current_date, last_date)
    .then(([result, fields]) => {
        result = result.map(el => {
            return {
                date:el.date.toLocaleDateString(),
                day : el.date.toDateString().split(" ")[0],
                amount:el.total,
            }
        });
        res.send({date:date.getDate(), lastdate:lastdate.getDate(), result});
    }).catch(err => {
        res.send(err);
    });

}
