const Project = require('../models/project');

module.exports.create = async function(req, res) {
    await Project.create({
        name: req.body.name,
        author: req.body.author,
        description: req.body.description
    });

    return res.redirect('back');
}
