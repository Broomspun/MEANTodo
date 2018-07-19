const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
let jwt = require('jsonwebtoken');

let db_auth = mongojs('mongodb://admin:soskfk218@ds133550.mlab.com:33550/meantodos1208',['users']);

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header( 'Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    next();
});

/* Register User . */
router.post('/register', function (req, res) {
    const user = req.body;

    db_auth.users.save(user, function (err, result) {
        if(err){
            res.send(err);
        } else {
            let token = jwt.sign(result.valueOf('_id'), '123456');
            console.log(token);

            res.json({firstname: user.firstname, token});
        }
    });

});

/* Login User . */
router.post('/login', function (req, res) {
    const user = req.body;

    console.log(`${JSON.stringify(user)}`);

    db_auth.users.findOne({"email": user.email }, function (err, userinfo) {
        if(err){
            res.send(err);
        } else {
            console.log(userinfo);
            let password = userinfo.password;

            console.log(`db user password=${userinfo.password}`);
            console.log(`db user id=${userinfo.valueOf('_id')}`);

            if(password === user.password) {
                let token = jwt.sign(userinfo.valueOf('_id'), '123456');
                console.log(`token=${token}`);
                console.log(`user_id=${userinfo._id}`);
                res.json({status: true, firstname: userinfo.firstname, token});
            } else {
                res.json({status: false, message: 'email or password incorrect'});
            }
        }
    });

});

/* User Info . */
router.get('/users/me', checkAuthenticated, (req, res) => {
    res.json(req.user);
});

router.put('/users/me', checkAuthenticated, (req, res) => {
    let user = req.user;
    let updObj = {};
    updObj.firstname = req.body.firstname;
    updObj.lastname = req.body.lastname;
    updObj.password = req.user.password;
    updObj.email = req.user.email;

    db_auth.users.update({
        _id: mongojs.ObjectID(req.user._id)
    }, updObj, {}, (err, result) => {
        if(err){
            res.send(err);
        } else {
            console.log(`result: ${JSON.stringify(result)}`);
            res.json(updObj.firstname);
        }
    })
});


function checkAuthenticated(req, res, next) {
    // console.log(`header = ${JSON.stringify(req.headers)}`);
    if(!req.headers['authorization']){
        return res.status(401).send({
            message: 'Unauthorized requested. Missing authorization header!'
        })
    }

    let token = req.header('authorization').split(' ')[1];

    console.log(`token=${token}`);
    let payload = jwt.decode(token, '123456');

    console.log(`payload=${JSON.stringify(payload)}`);

    if(!payload) {
        return res.status(401).send({
            message: 'Unauthorized requested. Missing authorization header invalid!'
        })
    }

    req.user = payload;

    next()
}


module.exports = router;
