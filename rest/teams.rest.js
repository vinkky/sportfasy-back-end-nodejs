module.exports = function (router, Team, PlayersLedger, TeamsService) {
    router.route('/teams/:team_id?')
        .post(function (req, res) {
            Team.findOne({name: req.body.name}, function (err, team) {
                if (!team) {
                    let team = new Team({
                        name: req.body.name,
                        _team_master: req.body._team_master,
                        _players: req.body._players,
                        _tournament: req.body._tournament,
                        created_at: req.body.created_at,
                        updated_at: req.body.updated_at,
                        user_points_converted: false
                    });
                    // save the team and check for errors
                    team.save(function (err) {
                        if (err) {
                            console.log('ERROR CREATING TEAM: ' + err);
                            res.status(500).json({error: err});
                        } else {
                            console.log('SUCCESS CREATING TEAM: ' + team.name);

                            res.status(200).json({message: 'Team created!', team: team});

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
            (function () {
                switch (String(Object.keys(req.query).sort())) {
                    case 'team_id':
                        PlayersLedger.find({'_team': req.query.team_id || 0}).exec(function (err, ledger_entries) {
                            if (err) {
                                console.log('ERROR GETTING team incomes in ledger: ');
                                res.status(500).json({error: err});
                            } else {

                                if (ledger_entries.length !== 0) {
                                    total_income = ledger_entries.reduce((sum, entry) => {
                                        return sum + entry._total_income
                                    }, 0);
                                    res.status(200).json({
                                        "team_id": req.query.team_id,
                                        "total_income": total_income
                                    });
                                }
                            }
                        });
                        break;
                    default:
                        Team.find().populate('_players').populate('_team_master').exec(function (err, teams) {
                            if (err) {
                                console.log('ERROR GETTING TEAMS: ');
                                res.status(500).json({error: err});
                            } else {
                                console.log('SUCCESS GETTING TEAMS');
                                res.status(200).json(teams);
                            }
                        });
                }
            })();
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
            Team.find({name: req.params.name}).populate('_players').populate('_team_master').exec(function (err, team) {
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