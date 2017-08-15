module.exports = function (router, Team, PlayersLedger) {
    router.route('/teams')
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
            Team.find().populate('_players').populate('_team_master').exec(function (err, teams) {
                if (err) {
                    console.log('ERROR GETTING TEAMS: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING TEAMS');

                    let team_promise = teams.map((team) => {

                        return new Promise((resolve, reject) => {

                             PlayersLedger.find({'_team': team._id}).exec(function (err, ledger_entries) {
                                if (err) {
                                    console.log('ERROR GETTING team incomes in ledger: ');
                                } else {

                                    if (ledger_entries.length !== 0) {
                                        team.total_incomes = ledger_entries.reduce((sum, entry) => {
                                            return sum + entry._total_income
                                        }, 0);
                                        // console.log(team);

                                        // console.log(team.name + 'alfa');



                                    }

                                }


                            }).then(() => {

                                 let players_promise = team._players.map((player)=>{


                                     return new Promise((resolve, reject) => {
                                         PlayersLedger.find({$and: [{'_team': team._id}, {'_player': player._id}]}).exec(function (err, ledger_entries) {
                                             if (err) {
                                                 console.log('ERROR GETTING player incomes in ledger: ');
                                             } else {

                                                 if (ledger_entries.length !== 0) {
                                                     player.total_incomes = ledger_entries.reduce((sum, entry) => {
                                                         return sum + entry._total_income
                                                     }, 0);
                                                     console.log(player);
                                                     // console.log(team.name + 'alfa');

                                                 }
                                             }
                                         }).then(() => {
                                             resolve()
                                         });
                                     });

                                 });


                                 Promise.all(players_promise).then(() => {
                                     console.log(JSON.stringify(teams, null, 2));
                                     resolve();
                                 });
                                // console.log(team.name + 'beta');


                            });

                        });

                        // console.log('response')
                    });
                    Promise.all(team_promise).then(() => console.log(JSON.stringify(teams, null, 2)));
                    // res.status(200).json(teams);
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