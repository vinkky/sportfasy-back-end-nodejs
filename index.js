let http = require('http');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let User = require('./models/users');


// ======
// ROUTES
// ======

let router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());


// allow cross domain connection
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.listen(3000, function () {
    console.log('App listening on port 3000');
});


// ======================================================
// REGISTER ROUTES: all routes will be prefixed with /api
app.use('/api', router);
// ======================================================


require('./rest/users.rest.js')(router, User);