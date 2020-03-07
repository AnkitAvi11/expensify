const { validationResult } = require('express-validator');

module.exports.getLogin = (req, res, next) => {
    res.render("./users/login", {
        title : "Login",
        path : "/login",
        css : [],
        js : [],
        error : req.flash("error"),
        success : req.flash("success")
    });
    
};

module.exports.getSignup = (req, res, next) => {
    res.render("./users/signup", {
        title : "Signup",
        path : "/signup",
        css : [],
        js : [],
        error : req.flash("error"),
        success : req.flash("success")
    });  
};

module.exports.postSignup = (req, res, next) => {
    let error = validationResult(req);
    if (error.isEmpty()) {
        res.send(req.body);
    } else {
        req.flash('error', error.errors[0].msg);
        req.session.save(() => {
            res.redirect('/auth/signup');
        });        
    }
};

module.exports.postLogin = (req, res, next) => {

};
