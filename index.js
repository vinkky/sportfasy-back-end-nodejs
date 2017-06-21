let http = require('http');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let User = require('./models/users');
let config = require('./config');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

// ======
// MONGO DB
// ======

let mongoose = require('mongoose');
mongoose.connect(config.database);


// ======
// ROUTES
// ======

let router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// set token secret
app.set('superSecret', config.secret);


// allow cross domain connection
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(3000, function () {
    console.log('App listening on port 3000');
});


// ======================================================
// REGISTER ROUTES: all routes will be prefixed with /api
app.use('/api', router);
// ======================================================


require('./rest/users.rest.js')(router, User , bcrypt);



router.route('/login')
    .post(function (req, res) {
        let response = res;
        User.findOne({email: req.body.email}, function (err, user) {
            if (user) {
                bcrypt.compare(req.body.password, user.password, function (err, res) {
                    if (err) {
                        console.log('ERROR TO LOGN: ' + err);
                        response.status(500).json({error: err});
                    } else {
                        if (res) {
                            console.log('SUCCESS TO LOGIN ' + user.name);

                            let token = jwt.sign(user, app.get('superSecret'), {
                                expiresIn: 60 * 60 * 24 // expires in 24 hours
                            });

                            response.status(200).json({
                                success: true,
                                message: 'Token is set!',
                                token: token,
                                userID: user._id,
                                userEmail: user.email
                            });
                        } else {
                            console.log('FAIL TO LOGIN ' + user.name);
                            response.status(401).json({message: 'FAIL TO LOGIN', user});
                        }
                    }
                });

            } else {
                console.log('User with this email not egists'.green);
                // res.status(200).json(user);
                res.status(200).json({"message": "User with this email eqists"});
            }
        });
    });