const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/issue_tracker_development`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function() {
    console.log('Connected to Database - issue_tracker_development :: MongoDB');
});

module.exports = db;