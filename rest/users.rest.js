module.exports = function (router, User) {
    router.route('/users')
        .post(function (req, res) {

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
                    res.status(200).json({message: 'User created!'});
                }
            });
        })
        //Get all users
        .get(function (req, res) {
            User.find(function (err, users) {
                if (err) {
                    console.log('ERROR GETTING USERS: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING USERS');
                    res.status(200).json(users);
                }
            });
        });
    router.route('/users/:email')
    // get user by email (accessed at GET http://localhost:3000/api/users/:email)
        .get(function (req, res) {
            User.find({ email: req.params.email}, function (err, user) {
                if (err) {
                    console.log('ERROR GETTING USER: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING USER'.green + (' email:' + req.params.email));
                    res.status(200).json(user);
                }
            });
        });
};