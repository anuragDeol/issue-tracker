const Project = require('../models/project');
const Issue = require('../models/issue');

// renders the 'project' which is clicked by user (project id is passed in req.params)
module.exports.home = async function(req, res) {
    try {
        // find the project (clicked by user) in the database
        let project = await Project.findById(req.params.id)
        .populate({
            path: 'issues'
        });

        // getting all the authors, so user can filter based upon authors
        let authors = [];
        for(issue of project.issues) {
            if(authors.indexOf(issue) === -1) {
                authors.push(issue.author);
            }
            else {
                console.log("element already exist");
            }
        }
        // eliminating duplicates from authors[] array, using set
        const set = new Set(authors);
        const uniqueAuthors = [...set];
        return res.render('project_detail', {
            project: project,
            authors: uniqueAuthors
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
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

// delete project
module.exports.destroy = async function(req, res) {
    // delete the project (anyone can delete it, as there is no authentication)
    let project = await Project.findByIdAndDelete(req.params.id);
    
    // delete associated issues
    await Issue.deleteMany({project: req.params.id});

    console.log('project and associated issues deleted');
    
    return res.redirect('back');
}
