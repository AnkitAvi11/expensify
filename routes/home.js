const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
    if(req.session.loggedin) {
        //  if the user is loggedin 

    } else {
        //  if the user not logged in 
        res.render('landing', {
            title : "Expensify : Home",
            path : "/",
            css : [],
            js : []
        });
    }
});

module.exports = router;