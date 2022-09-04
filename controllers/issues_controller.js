const Project = require('../models/project');
const Issue = require('../models/issue');

module.exports.create = async function(req, res) {
    try{
        let project = await Project.findById(req.body.project);
        if(project) {
            let issue = await Issue.create({
                title: req.body.title,
                description: req.body.description,
                labels: req.body.labels,
                author: req.body.author,
                project: req.body.project
            });

            project.issues.push(issue);
            project.save();

            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}