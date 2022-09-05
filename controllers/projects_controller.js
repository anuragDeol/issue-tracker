const Project = require('../models/project');

// renders the 'project' which is clicked by user (project id is passed in req.params)
module.exports.home = async function(req, res) {
    try {
        // find the project (clicked by user) in the database
        let project = await Project.findById(req.params.id)
        .populate({
            path: 'issues'
        });
        return res.render('project_detail', {
            project: project
        });
    } catch (err) {
        console.log(err);
        return;
    }
}

// create new project
module.exports.create = async function(req, res) {
    await Project.create({
        name: req.body.name,
        author: req.body.author,
        description: req.body.description
    });

    return res.redirect('back');
}
