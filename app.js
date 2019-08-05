const express = require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require ('connect-flash');
const session = require ('express-session');
const passport=require('passport');

const app=express();
const port=process.env.port || 5000;
require('./config/passport')(passport);
app.use(expressLayouts);
app.set('view engine','ejs'); 
app.use(express.urlencoded({ extended :false}));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req,res,next)=>{
res.locals.success_msg=req.flash('success_msg');
res.locals.error_msg=req.flash('error_msg');
res.locals.error=req.flash('error');
next();
});

const db=require('./config/keys').MongoURI; 
mongoose.connect(db,{ useNewUrlParser : true  })
.then(()=> console.log('mongodb connected...'))
.catch(err=> console.log(err));


app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.listen(port,console.log(`server running on port ${port}`));