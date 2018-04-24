var express = require('express');
var router = express.Router();
var Task = require('../models/task');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.username = req.user.local.username;
        next();
    } else {
        res.redirect('/auth')
    }
}
router.use(isLoggedIn);

/* GET home page. */
router.get('/', function(req, res, next) {
  Task.find({_creator: req.user, completed: false})
      .then((docs) => {
          res.render('index', { title: 'Incomplete tasks', tasks: docs});
      })
      .catch((err) => {
    next(err);
      });
});
/*Add a new task*/
router.post('/add', function(req, res, next){

    if (!req.body || !req.body.text) {
        req.flash('error', 'Please enter some text');
        res.redirect('/');
    }

    else {
        // Save new task with text provided, for the current user, and completed = false
        var task = Task({ _creator: req.user, text : req.body.text, completed: false, dateCreated: new Date()});
        task.save()
            .then(() => {
                res.redirect('/');
            })
            .catch((err) => {
                next(err);
            });
    }
});
/*finish the task and send to completed tasks*/
router.post('/done', function(req, res, next){
    Task.findOneAndUpdate( {_id: req.body._id, _creator: req.user.id}, {completed: true, dateCompleted: new Date()})
        .then( (task) => {

            if (!task) {
                res.status(403).send('This is not your task!');
            }

            else {
                req.flash('info', 'Task marked as done');
                res.redirect('/')
            }

        })
        .catch( (err) => {
            next(err);
        });
});
/*completed page*/
router.get('/completed', function(req, res, next) {
    Task.find({_creator: req.user._id, completed:true, dateDeleted: null})
        .then((docs) => {
            res.render('completed_tasks', {tasks: docs});
        }).catch((err) => {
            next(err);
        });
});
/*delete the specific tasks*/
router.post('/delete', function(req, res, next){

    Task.findOneAndRemove( {_id: req.body._id, _creator: req.user._id}, {completed: true, dateDeleted: new Date()} )
        .then( (task) => {
            if (!task)  { // No task deleted, therefore the ID is not valid,
                //or did not belong to the current logged in user.
                res.status(403).send('This is not your task!');
            }
            else {
                res.redirect('/completed');
                req.flash('info', 'Task deleted');
            }
        })
        .catch( (err) => {
            next(err);
        });

});
/*marks all the tasks as done*/
router.post('/alldone', function(req, res, next){

    Task.update( {_creator: req.user, completed: false}, {completed: true, dateCompleted: new Date()}, {multi: true})
        .then( (result) => {
            req.flash('info', 'All tasks are done!');
            res.redirect('/')
        })
        .catch( (err) => {
            next(err);
        });
});
/*getting a specific page per task*/
router.get('/task' + '/:_id', function(req, res, next){
    Task.findById(req.params._id).then( (task) => {

        if (!task) {
            res.status(404).send('Task not found.');
        }

        // Verify that this task was created by the currently logged in user
        else if (!task._creator.equals(req.user._id)) {
            res.status(403).send('This is not your task!');  // 403 Unauthorized
        }

        else {
            res.render('task_detail', {task:task})
        }

    }).catch( (err) => {
        next(err);
    });
});
/*delete all the completed task in the completed page*/
router.post('/deleteDone', function(req, res, next){
    Task.deleteMany({_creator: req.user, completed:true})
        .then(()=>{
            req.flash('info', 'All completed tasks deleted');
            res.redirect('/');
        })
        .catch((err) => {
            next(err);
        })
});

module.exports = router;
