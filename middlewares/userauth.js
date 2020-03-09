module.exports.isloggedin = (req, res, next) => {
    if(req.session.loggedin) {
        return res.redirect("/");
    }
    return next();
}

module.exports.isAuth = (req, res, next) => {
    if(!req.session.loggedin) {
        return res.redirect("/");
    }
    return next();
}