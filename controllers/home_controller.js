const Project = require('../models/project');

module.exports.home = async function(req, res) {
    try {
        const projects = await Project.find({});
        // console.log(projects);   // used for debug
        return res.render('home', {
            projects: projects
        });
    } catch(err) {
        console.log(err);
    }
    
}