module.exports = function (router, Tournament, User) {
    router.route('/tournaments/:userID?')
        // add new tournament
        .post(function (req, res) {
            Tournament.findOne({name: req.body.name}, function (err, tournament) {
                if (!tournament) {
                    let tournament = new Tournament({
                        name: req.body.name,
                        start: req.body.start,
                        end: req.body.end,
                        max_teams: req.body.max_teams,
                        max_players: req.body.max_players,
                        _teams: req.body.teams,
                        _users: req.body.users,
                        budget: req.body.budget,
                        _tournament_master: req.body.tournament_master,
                        created_at: req.body.created_at,
                        updated_at: req.body.updated_at
                    });
                    // save the tournament and check for errors
                    tournament.save(function (err) {
                        if (err) {
                            console.log('ERROR CREATING TOURNAMENT: ' + err);
                            res.status(500).json({error: err});
                        } else {
                            console.log('SUCCESS CREATING TOURNAMENT: ' + tournament.name);
                            res.status(200).json({message: 'Tournament created!', tournament});
                        }
                    });
                } else {
                    console.log('Tournament with this name eqists'.green);
                    res.status(409).json({"message": "Tournament with this name egists"});
                }
            });
        })
        .get(function (req, res) {

            let query = function(){if(req.query.userID){return {_users: {_id: req.query.userID}}}}();
                // get all tournaments
                Tournament.find(query).populate('_users').populate('_teams').populate('_tournament_master').exec(function (err, tournament) {
                    if (err) {
                        console.log('ERROR GETTING TOURNAMENTS: ');
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS GETTING TOURNAMENTS');
                        res.status(200).json(tournament);
                    }
                });
        })
        // update tournament
        .put(function (req, res) {
            // update tournament by name
            Tournament.findOne({name: req.body.name}, function (err, tournament) {
                if (err) {
                    console.log('ERROR UPDATING TOURNAMENT: ' + err.errmsg);
                    res.status(500).json({error: err});
                    return 0;
                }
                for (var key in req.body) {
                    tournament[key] = req.body[key];
                }
                // save user
                tournament.save(function (err) {
                    if (err) {
                        console.log('ERROR UPDATING TOURNAMENT: ' + err);
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS UPDATING TOURNAMENT: ' + tournament.name);
                        res.status(200).json({message: 'Tournament updated!'});
                    }
                });
            });
        })
        // delete tournament
        .delete(function (req, res) {
            Tournament.remove(
                {
                    name: req.body.name
                }, function (err, tournament) {
                    if (err) {
                        console.log('ERROR DELETING TOURNAMENT: ' + err.errmsg);
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS DELETING TOURNAMENT' + (' name: ' + req.body.name));
                        res.status(200).json({message: 'Successfully deleted tournament: ' + req.body.name});
                    }
                });
        });
};