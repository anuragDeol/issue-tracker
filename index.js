const express = require('express');
const app = express();
const port = 8000;

// view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', require('./routes'));

app.listen(port, function(err) {
    if(err) {
        console.log(`Error in running server`, err);
    }
    console.log(`Server is running on port: ${port}`);
});