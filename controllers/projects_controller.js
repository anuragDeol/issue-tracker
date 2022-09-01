const Project = require('../models/project');

module.exports.create = async function(req, res) {
    await Project.create({
        name: req.name,
        author: req.author,
        description: req.description
    });

    return res.redirect('back');
}
