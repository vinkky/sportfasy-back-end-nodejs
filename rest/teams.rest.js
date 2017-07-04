let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let User = require('../models/users');

let user_new = new User();


module.exports = function (router, Team) {
    router.route('/teams')
        .post(function (req, res) {
            Team.findOne({name: req.body.name}, function (err, team) {
                if (!team) {
                    //finding user
                    User.findOne({email: req.body.master}, function(err,obj) { user_new = obj; console.log(obj); });
                    //console.log("USER NEW: " + user_new.name);
                    // user_new.save();


                    let team = new Team({
                        name: req.body.name,
                        master: req.body.master,
                        players: req.body.players,
                        created_at: req.body.created_at,
                        updated_at: req.body.updated_at,
                        creator: {
                            name: user_new.name,
                            user: user_new._id
                        }
                    });
                    //populate team
                    team.save(function(error) {
                        if (!error) {
                            Team.find({})
                                .populate('creator.user')
                                .exec(function(error, team) {
                                })
                        }
                    });
                    // save the team and check for errors
                    team.save(function (err) {
                        if (err) {
                            console.log('ERROR CREATING TEAM: ' + err);
                            res.status(500).json({error: err});
                        } else {
                            console.log('SUCCESS CREATING TEAM: ' + team.name);
                            res.status(200).json({message: 'Team created!', team});
                        }
                    });
                } else {
                    console.log('Team with this name eqists'.green);
                    res.status(409).json({"message": "Team with this name egists"});
                }
            });
        })
        //Get all teams
        .get(function (req, res) {
            Team.find(function (err, team) {
                if (err) {
                    console.log('ERROR GETTING TEAMS: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING TEAMS');
                    res.status(200).json(team);
                }
            });
        })

        //Update team
        .put(function (req, res) {
            // update team by name
            Team.findOne({name: req.body.name}, function (err, team) {

                if (err) {
                    console.log('ERROR UPDATING TEAM: ' + err.errmsg);
                    res.status(500).json({error: err});
                    return 0;
                }

                for (let key in req.body) {
                    team[key] = req.body[key];
                }

                // save team
                team.save(function (err) {
                    if (err) {
                        console.log('ERROR UPDATING TEAM: ' + err);
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS UPDATING TEAM: ' + team.name);
                        res.status(200).json({message: 'Team updated!'});
                    }
                });

            });
        })
        //Delete team
        .delete(function (req, res) {
            Team.remove(
                {
                    name: req.body.name
                }, function (err, team) {
                    if (err) {
                        console.log('ERROR DELETING TEAM: ' + err.errmsg);
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS DELETING TEAM' + (' name: ' + req.body.name));
                        res.status(200).json({message: 'Successfully deleted team: ' + req.body.name});
                    }
                });
        });

    router.route('/teams/:name')
        // get team by name (accessed at GET http://localhost:3000/api/teams/:name)
        .get(function (req, res) {
            Team.find({name: req.params.name}, function (err, team) {
                if (err) {
                    console.log('ERROR GETTING TEAM: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING TEAM'.green + (' name:' + req.params.name));
                    res.status(200).json(team);
                }
            });
        });
};

