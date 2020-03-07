module.exports.isloggedin = (req, res, next) => {
    if(req.session.loggedin) {
        return res.redirect("/");
    }
    return next();
}