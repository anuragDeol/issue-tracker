const Project = require('../models/project');
const Issue = require('../models/issue');

// create new issue and link newly created issue with the project (under which it is added by the user)
module.exports.create = async function(req, res) {
    // console.log(req.body);
    try{
        // check if the project id (in which user wants to add new issue), is valid
        let project = await Project.findById(req.body.project);
        if(project) {
            // if yes then create new 'issue' document and add it in 'Issue' model
            let issue = await Issue.create({
                title: req.body.title,
                description: req.body.description,
                // labels: req.body.labels,
                author: req.body.author,
                project: req.body.project
            });

            // adding labels to the issue (if user has ticked the label)
            if(req.body.issueLabelOne == 'on') {
                issue.labels.push("Severity-1");
                await issue.save();     // using await is important here, because we are doing save() multiple times to the document in same event loop
            }
            if(req.body.issueLabelTwo == 'on') {
                issue.labels.push("Severity-2");
                await issue.save();
            }
            if(req.body.issueLabelThree == 'on') {
                issue.labels.push("Severity-3");
                await issue.save();
            }
            if(req.body.issueLabelFour == 'on') {
                issue.labels.push("Severity-4");
                await issue.save();
            }
            
            // // DEBUG::to check if the array of labels inside 'issue' is being filled or not
            // if(issue.labels.length>0) {
            //     for(itr of issue.labels) {
            //         console.log(itr + ", ");
            //     }
            // } else {
            //     console.log('no label in this issue');
            // }

            // let issue = await Issue.create(req.body);

            // link the 'issue' with the 'project'
            project.issues.push(issue);
            project.save();

            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}


// TODO::when adding new filter now, the filter form is getting submitted::DEBUG
module.exports.filter = async function(req, res) {
    try {
        // console.log('filter issues by author:', req.body.author);

        let project = await Project.findById(req.body.project)
        .populate({
            path: 'issues'
        });

        // getting all the authors, so user can filter based upon authors
        let authors = [];
        for(let issue of project.issues) {
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

        // find all the issues which are posted by 'req.body.author'
        let filteredIssues = await Issue.find({author: req.body.author});
        if(filteredIssues.length==0) {
            // if user removes the filter, then we need to show all issues
            // setting filteredIssues as undefined, so that in our views file, we fetch all the issues from 'project.issues'
            filteredIssues = undefined
        }

        // console.log(req.body.author);
        // console.log(filteredIssues);
        return res.render('project_detail', {
            project: project,
            issues: filteredIssues, // issues will be undefined if user does not want to filter
            authors: uniqueAuthors
        })
    } catch (err) {
        console.log('error in filtering:', err);
    }
}