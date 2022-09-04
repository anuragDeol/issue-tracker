const Project = require('../models/project');

// takes us to the 'project' which user clicked - id of the project is passed in params
module.exports.home = async function(req, res) {
    try {
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

module.exports.create = async function(req, res) {
    await Project.create({
        name: req.body.name,
        author: req.body.author,
        description: req.body.description
    });

    return res.redirect('back');
}
