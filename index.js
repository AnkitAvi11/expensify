const express = require('express');
const database = require('./utils/database');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const path = require('path');
const flash = require('connect-flash');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());

//  setting up the view engine and serving the static files folder
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use('/public', express.static(path.join(__dirname, 'public')));

//  creating the session storage
const SessionStore = new MysqlStore({
    schema : {
        tableName : 'session_storage'
    }
}, database);

app.use(session({   //  initiating the session
    store : SessionStore,
    secret : "my-secret",
    resave : false,
    saveUninitialized : false
}));

app.use(csrf());
app.use(flash());

//  getting all the routes of the application
const indexRoute = require('./routes/home');
const authRoute = require('./routes/auth');

//  setting up the locals
app.use((req, res, next) => {
    res.locals.loggedin = req.session.loggedin;
    res.locals.user = req.session.user;
    res.locals.csrfToken = req.csrfToken();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-type:Authorization");
    next();
});

//  registering all the routes
app.use(indexRoute);
app.use('/auth',authRoute);

//  this is for the not found error
app.use((req, res, next) => {
    res.render('404', {
        title : 'Page not found',
        css : [],
        js : [],
        path : '/'
    });
});

//  this is for controlling the unintensional errors
app.use((err, req, res, next) => {
    res.send(err);
});

app.listen(PORT, () => {
    console.log(`Listening to the port : ${PORT}`);
});