const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
let db = mongojs('mongodb://admin:soskfk218@ds133550.mlab.com:33550/meantodos1208',['todos']);
let db_message = mongojs('mongodb://admin:soskfk218@ds133550.mlab.com:33550/meantodos1208',['messages']);

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

    const todo = req.body;
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
    const todo = req.body;
    const updObj = {};

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

/* GET Messages . */
router.get('/messages', function(req, res, next) {
    db_message.messages.find(function (err, messages) {
        if(err){
            res.send(err);
        } else {
            // console.log(messages);
            res.json(messages);
        }
    })

});


/* GET Messages from user name . */
router.get('/messages/:user', function(req, res, next) {
    let username = req.params.user;
    console.log(username);
    db_message.messages.find({"owner": username}, function (err, messages) {
        if(err){
            res.send(err);
        } else {
            console.log(messages);
            res.json(messages);
        }
    })

});

/* POST Messages . */
router.post('/messages', function (req, res) {
    const message = req.body;
    console.log(message);

    db_message.messages.save(message, function (err, result) {
        if(err){
            res.send(err);
        } else {
            console.log(result);
            res.json(result);
        }
    });

});


module.exports = router;
