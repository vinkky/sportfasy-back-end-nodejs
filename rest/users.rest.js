module.exports = function (router, User, jwt, superSecret) {
    router.route('/users/:token?')
        // add new user
        .post(function (req, res) {
            User.findOne({email: req.body.email}, function (err, user) {
                if (!user) {
                    let user = new User({
                        name: req.body.name,
                        surname: req.body.surname,
                        password: req.body.password,
                        email: req.body.email,
                        created_at: req.body.created_at,
                        updated_at: req.body.updated_at
                    });
                    // save the user and check for errors
                    user.save(function (err) {
                        if (err) {
                            console.log('ERROR CREATING USER: ' + err);
                            res.status(500).json({error: err});
                        } else {
                            console.log('SUCCESS CREATING USER: ' + user.name);
                            res.status(200).json({message: 'User created!', user});
                        }
                    });
                } else {
                    console.log('User with this email eqists'.green);
                    res.status(409).json({"message": "User with this email egists"});
                }
            });
        })
        // get all users
        .get(function (req, res) {
            let token = req.body.token || req.query.token || req.headers['x-access-token'];
            jwt.verify(token, superSecret, function (err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.',
                        error: err
                    });
                } else {
                    res.status(200).json(decoded._doc);
                }
            });
        });
};