const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require("connect-flash");
const session = require('express-session')
require('dotenv').config();
const app = express();



// Passport Config
require('./config/passport')(passport);

//config db
const db = require("./config/keys").mongoURI;
mongoose.set('strictQuery', true);
mongoose.connect(db, {
    useNewUrlParser: true
}).then(err => console.log("MongoDB Connected...")).catch(err => console.log(err))

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//static files 
app.use(express.static('public'));
app.use(express.static('node_modules'));

//bodyParser
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

//express sessions
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//routes
app.use('/', require('./routes/index-routes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/users', require('./routes/inner-index-routes'));
app.use('/filter', require('./routes/filtreReqs'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("The Server Listening in " + PORT);
});