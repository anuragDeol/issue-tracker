const Project = require('../models/project');

// renders home page
module.exports.home = async function(req, res) {
    try {
        const projects = await Project.find({});
        return res.render('home', {
            projects: projects
        });
    } catch(err) {
        console.log(err);
    }
    
}