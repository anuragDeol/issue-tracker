const Project = require('../models/project');
const Issue = require('../models/issue');
const home_controller = require('../controllers/home_controller')

// create new issue and link newly created issue with the project (under which it is added by the user)
module.exports.create = async function(req, res) {
    // console.log(req.body);
    try{
        // check if the project id (in which user wants to add new issue), is valid
        let project = await Project.findById(req.body.project)
        .populate({
            path: 'issues'
        });
        
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
                console.log(req.body.issueLabelOne);
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
            // link the 'issue' with the 'project'
            project.issues.push(issue);
            project.save();

            console.log('Success! New issue created and added into the database');

            // return res.redirect('back');     // after filtering when i create new issue, this is taking me back to /issues/filter with a get request, which is giving error
            

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
            
            console.log(project.issues);
            return res.render('project_detail', {
                project: project,
                authors: uniqueAuthors
            });
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}


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


        // FILTER
        // find all the issues which are posted by 'req.body.filterAuthor' && 'req.body.filterLabel'
        let filteredIssues;
        //1. no filter
        if(!req.body.filterAuthor && !req.body.filterLabel) {
            console.log('No Filter');
            filteredIssues = await Issue.find({
                project: project._id
            });
        }
        //2. filter only by author
        else if(!req.body.filterLabel) {
            console.log('Filter only by Author');
            filteredIssues = await Issue.find({
                project: project._id,
                author: req.body.filterAuthor
            });
        }
        //3. filter by Lable(s)
        else if(!req.body.filterAuthor) {
            // 3. filter by only one label
            if(typeof(req.body.filterLabel) == "string") {
                console.log('Filter by only one label');
                filteredIssues = await Issue.find({
                    project: project._id,
                    labels: [req.body.filterLabel]
                });
            } else {
                // 3b. filter by multiple labels
                console.log('Filter by multiple labels');
                filteredIssues = await Issue.find({
                    project: project._id,
                    labels: req.body.filterLabel
                });
            }
            // filteredIssues = await Issue.find({
            //     project: project._id,
            //     labels: [req.body.filterLabel]
            // });
        }
        //4. filter by both
        else {
            console.log('Filter by both author and one label');
            //4a. author and one label
            if(typeof(req.body.filterLabel) == "string") {
                console.log('Filter by both author and one label');
                filteredIssues = await Issue.find({
                    project: project._id,
                    author: req.body.filterAuthor,
                    labels: [req.body.filterLabel]
                });
            } else {
                //4b. author and multiple labels
                console.log('Filter by both author and multiple labels');
                filteredIssues = await Issue.find({
                    project: project._id,
                    author: req.body.filterAuthor,
                    labels: req.body.filterLabel
                });
            }
            // filteredIssues = await Issue.find({
            //     project: project._id,
            //     author: req.body.filterAuthor,
            //     labels: req.body.filterLabel
            // });
        }

        // if(filteredIssues.length==0) {
        //     // if user removes the filter, then we need to show all issues
        //     // setting filteredIssues as undefined, so that in our views file, we fetch all the issues from 'project.issues'
        //     filteredIssues = undefined
        //     console.log('entered into area where we shouldnt have');
        // }


        return res.render('project_detail', {
            project: project,
            filteredIssues: filteredIssues, // issues will be undefined if user does not want to filter
            authors: uniqueAuthors
        })
    } catch (err) {
        console.log('error in filtering:', err);
        return res.redirect('back');
    }
}



module.exports.search = async function(req, res) {
    try {
        let title = req.body.title;
        let description = req.body.description;
        
        let filteredIssues;
        console.log(title);
        console.log(description);
        if(title && description) {
            console.log('find by title & description', title);
            filteredIssues = await Issue.find({
                project: req.body.project,
                title: req.body.title,
                description: req.body.description
            });
        } else if(title) {
            console.log('find by title only', title);
            filteredIssues = await Issue.find({
                project: req.body.project,
                title: req.body.title,
            });
        } else if (description) {
            console.log('find by description only', description);
            filteredIssues = await Issue.find({
                project: req.body.project,
                description: req.body.description,
            });
        }


        let project = await Project.findById(req.body.project)
        .populate({
            path: 'issues'
        });

        let authors = [];
        for(let issue of project.issues) {
            if(authors.indexOf(issue) === -1) {
                authors.push(issue.author);
            }
            else {
                console.log("element already exist");
            }
        }

        const set = new Set(authors);
        const uniqueAuthors = [...set];

        return res.render('project_detail', {
            project: project,
            authors: uniqueAuthors,
            filteredIssues: filteredIssues
        })
    } catch (err) {
        console.log('error in filtering:', err);
        return res.redirect('back');
    }

}


module.exports.destroy = async function(req, res) {
    try {
        
        

        let issue = await Issue.findById(req.params.id);
        if(issue) {
            let project = await Project.findById(issue.project)
            
            // delete issue from database
            issue.remove();

            // unlink issue from its project
            await Project.findByIdAndUpdate(project._id, {$pull: {issues: req.params.id}});
            
            // populate 'issues' in 'Project'
            project = await Project.findById(issue.project)
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
        } else {
            console.log("invalid issue id");
            return;
        }
    } catch(err) {
        console.log("Error in deleting issue", err);
        return;
    }
}
