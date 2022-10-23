require("dotenv").config(); // to read '.env' file
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const expressLayouts = require('express-ejs-layouts');
// const db = require('./config/mongoose');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const { default: mongoose } = require("mongoose");


app.use(express.urlencoded({extended: false}));


app.use(sassMiddleware({
    src: './assets/scss',   // our middleware will pick scss files from here to convert them into css
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',    // we want our code in multiple lines
    prefix: '/css'  // where should my server lookout for css files
}));


// middleware to parse the request
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// view engine - ejs
app.set('view engine', 'ejs');
app.set('views', './views');

// index router
app.use('/', require('./routes'));

// DB Connection
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Success! MongodbAtlas DB Connected");
    });

app.listen(port, function(err) {
    if(err) {
        console.log(`Error in running server`, err);
    }
    console.log(`Server is running on port: ${port}`);
});