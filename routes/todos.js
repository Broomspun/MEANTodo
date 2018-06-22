var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:soskfk218@ds133550.mlab.com:33550/meantodos1208',['todos']);

/* GET Todos . */
router.get('/todos', function(req, res, next) {
    db.todos.find(function (err, todos) {
        if(err){
            res.send(err);
        } else {
            res.json(todos);
        }
    })
});


/* GET Single Todo. */
router.get('/todos/:id', function(req, res, next) {
    db.todos.findOne({
        _id: mongojs.ObjectID(req.params.id)
    }, function (err, todos) {
        if(err){
            res.send(err);
        } else {
            res.json(todos);
        }
    })
});


//Save Todo
router.post('/todo', function (req, res, next) {
    var todo = req.body;
    console.log(req.body);

    if(!todo.text || !(todo.isCompleted + '')){
        res.status(400);
        res.json({
            "error": "Invalid Data"
        });
    } else {
        db.todos.save(todo, function (err, result) {
            if(err){
                res.send(err);
            } else {
                res.json(result);
            }
        });
    }
});


//Update todos
router.put('/todo/:id', function (req, res, next) {
    var todo = req.body;
    var updObj = {};

    if(todo.isCompleted){
        updObj.isCompleted = todo.isCompleted;
    }

    if(todo.text) {
        updObj.text = todo.text
    }

    if(!updObj){
        res.status(400);
        res.json({
            "error": "Invalid Data"
        });
    } else {
        db.todos.update({
            _id: mongojs.ObjectID
        }, updObj, {}, function (err, result) {
            if(err){
                res.send(err);
            } else {
                res.json(result);
            }
        })
    }
});

//Delete Todo
router.delete('/todo/:id', function (req, res, next) {
    db.todos.remove({
        _id: mongojs.ObjectID(req.params.id)
    }, '', function (err, result) {
        if(err){
            res.send(err);
        } else {
            res.json(result);
        }
    });

});

module.exports = router;
