const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');

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
        User.findByEmail(req.body.email)
        .then(([result, fields]) => {
            if(result.length > 0) {
                req.flash("error", "User already exists");
                req.session.save(() => {
                    return res.redirect("/auth/login");
                });
            }else{
                bcryptjs.hash(req.body.pwd, 12)
                .then(hashedpassword => {
                    req.body.pwd = hashedpassword;
                    let {fname, email, pwd} = req.body;
                    let user = new User({fname, email, pwd});
                    user.save()
                    .then(([result, fields]) => {
                        req.flash("success", "User registeration successful.");
                        req.session.save(() => {
                            return res.redirect("/auth/login");
                        });
                    }).catch(err => next(err));
                }).catch(err => {
                    return next(err);
                });
            }
        }).catch(err => next(err));

    } else {
        req.flash('error', error.errors[0].msg);
        req.session.save(() => {
            res.redirect('/auth/signup');
        });        
    }
};

module.exports.postLogin = (req, res, next) => {
    let error = validationResult(req);
    if(error.isEmpty()) {
        let {email, pwd} =  req.body;
        User.getUser(email)
        .then(([data, field]) => {
            let cpwd = data[0].pwd;
            let {user_id, fname, email} = data[0];
            bcryptjs.compare(pwd,cpwd)
            .then(result => {
                if(result) {

                    req.session.loggedin = true; 
                    let user = {
                        user_id,
                        fname, 
                        email 
                    };
                    req.session.user = user;    
                    req.session.save(() => {
                        res.redirect("/");
                    });
                    
                }else{
                    req.flash("error", "Password didn't match");
                    req.session.save(() => {
                        res.redirect("/auth/login");
                    });
                }
            }).catch(err => {
                return next(err);
            })
        }).catch(err => {
            res.send(err);
        });
    }else{
        req.flash('error', error.errors[0].msg);
        req.session.save(() => {
            res.redirect('/auth/login');
        });
    }
};
