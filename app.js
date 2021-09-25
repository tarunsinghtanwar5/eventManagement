const express=require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app=express();
const index=require('./routes/index')
const users = require('./routes/users')
const passport =require('passport')
const LocalStrategy =require('passport-local')
const session = require('express-session')


// DB Config
const db = require('./config/keys').mongoURI;
const user = require('./models/users');

// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


    //express-session
const sessionConfig = {
    name: 'session',
    secret:'verybadsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

//global currentUser
app.use((req,res,next)=>{
res.locals.currentUser=req.user;   
next();
})


//Ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');


//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate ()))


passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())


//To get data from form body
app.use(express.urlencoded({ extended: true }));



//Routes
app.use('/',index);
app.use('/users', users);





app.listen(3000,()=>{
    console.log("listening to port 3000")
})