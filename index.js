const express = require('express');
const app = express();
const port = 8000;
const db = require('./config/mongoose');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');


app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());


// view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// middleware to parse the request
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', require('./routes'));

app.listen(port, function(err) {
    if(err) {
        console.log(`Error in running server`, err);
    }
    console.log(`Server is running on port: ${port}`);
});