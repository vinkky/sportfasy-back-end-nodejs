module.exports = function (router, Tournament, User, TournamentTeams, TeamsService) {
    router.route('/tournaments/:userID?/:tournamentMaster?/:name?')
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
                        _tournament_master: req.body._tournament_master,
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
                    res.status(409).json({'message': 'Tournament with this name egists'});
                }
            });
        })
        //get all tournaments, where user participate or is a master
        .get(function (req, res) {
            let query = function () {
                switch (String(Object.keys(req.query).sort())) {
                    case 'tournamentMaster,userID':
                        return {$and: [{_users: req.query.userID}, {_tournament_master: req.query.tournamentMaster}]};
                        break;
                    case 'userID':
                        return {_users: req.query.userID};
                        break;
                    case 'tournamentMaster':
                        return {_tournament_master: req.query.tournamentMaster};
                        break;
                    case 'name':
                        return {name: req.query.name};
                        break;
                    default: //sita case tik bus ne gte o ktias
                        return {'end': {$gte: Date()}}
                }
            }();

            let populateQuery = [
                {path: '_team_master'}
            ];
            Tournament.find(query).populate(populateQuery).exec(function (err, tournaments) {
                if (err) {
                    console.log('ERROR GETTING TOURNAMENTS: ');
                    res.status(500).json({error: err});
                }
            }).then((tournaments => {
                tournament_prom = tournaments.map((tournament) => {

                    return new Promise((resolve, reject) => {

                        let populateQuery = [
                            {path: '_team', populate: [{path: '_players'}, {path: '_team_master'}]},

                        ];

                        TournamentTeams.find({_tournament: tournament._id}).populate(populateQuery).exec(function (err, tournamentTeams) {
                            if (err) {
                                console.log('ERROR GETTING TOURNAMENTS TEAMS: ');
                                res.status(500).json({error: err});
                            }
                            else {
                                // console.log('SUCCESS GETTING TOURNAMENTS TEAMS');
                                if (tournamentTeams.length !== 0) {
                                    tournament._teams = tournamentTeams.map(tournamentTeam => {
                                        // console.log(tournamentTeam._team);
                                        return tournamentTeam._team;
                                    });


                                    // console.log(JSON.stringify(tournament._teams,null,2));
                                } else {
                                    tournament._teams = [];
                                }

                                // return tournament;
                            }
                        }).then(() => {
                                // console.log('resolved tournament teams' + JSON.stringify(tournament,null,2) );
                                let team_promise = new TeamsService(tournament._teams).get_team_promise();

                                Promise.all(team_promise).then(() => {
                                    // console.log(JSON.stringify(teams, null, 2));
                                    resolve();
                                });
                            }
                        );

                    });


                });

                Promise.all(tournament_prom).then(() => {
                    console.log('resolved all tpournament teams' + JSON.stringify(tournaments,null,2));
                    console.log('done');
                    // return resolve();
                    res.status(200).json(tournaments);

                });

            }));
        })
        // update tournament
        .put(function (req, res) {
            // update tournament by name
            Tournament.findOne({name: req.body.name}).populate('_users').exec(function (err, tournament) {

                if (req.body.sumUsers) {
                    function calculate() {
                        sum = 0
                        for (let i = 0; i < req.body.sumUsers.length; i++) {
                            sum += req.body.sumUsers[i].price;
                        }
                        return sum;
                    }

                    if (calculate() <= tournament.budget) {
                        res.status(200).json({
                            sucess: true,
                            message: 'players price does not exeed tournament budget ' + req.body.name
                        });
                        console.log('nevirsija sumos    ' + calculate())
                    } else {
                        res.status(500).json({message: 'players price exeeds tournament budget ' + req.body.name});
                        console.log('virsija nustatyta suma   ' + calculate())
                    }
                } else {
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
                            res.status(200).json(tournament);

                        }
                    });
                }
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
    router.route('/tournament/:tou?')
}