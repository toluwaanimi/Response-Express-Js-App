const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userActivity = require('./api/routes/userActivity');
const complains = require('./api/routes/complainsRoute');


//to connect to mongoDB
//mongodb+srv://admin:<password>@bowenapi-k32iz.mongodb.net/test?retryWrites=true&w=majority


app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type,Accept,Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({})
  }
});
app.use('/user', userActivity);
app.use('/complains', complains);

app.use((req,res,next)=>{
    const error = new Error("Not found");
    error.status = 404;
    next(error)
});
app.use((error, req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error : {
            message :error.message
        }
    })
});

module.exports = app;
