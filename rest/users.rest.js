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

            user.save(function (err) {
                if (err) {
                    console.log('ERROR CREATING USER: ' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS CREATING USER: ' + user.name);
                    res.status(200).json({message: 'User created!'});
                }
            });

            // res.status(200).json({user});
        });
};