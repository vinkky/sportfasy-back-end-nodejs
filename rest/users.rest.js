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

            res.status(200).json({user});
        });
};