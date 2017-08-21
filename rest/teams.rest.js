module.exports = function (router, Team, PlayersLedger, TournamentTeams) {
    const mongoose = require('mongoose');
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

                        TournamentTeams.aggregate([
                                {$match: {"_team": new mongoose.Types.ObjectId(req.query.team_id)} },
                                {
                                    $lookup: {
                                        from: "playersledgers",
                                        localField: "_team",
                                        foreignField: "_team",
                                        as: "_team_ledger"
                                    }
                                },
                                {$unwind: "$_team_ledger"},
                                {
                                    $group: {
                                        _id: "$_id",
                                        _team: { $first: "$_team" },
                                        _tournament:{$first: "$_tournament"},
                                        team_total: {$sum: "$_team_ledger._total_income"},
                                    }
                                },
                                {$unwind: "$_tournament"},
                                {$sort:{tournament:1, team_total:-1,}},
                                {
                                    $lookup: {
                                        from: "teams",
                                        localField: "_team",
                                        foreignField: "_id",
                                        as: "_team"
                                    }
                                },
                                {$unwind: "$_team"},
                                {$unwind: "$_team._players"},
                                {
                                    $lookup: {
                                        from: "players",
                                        localField: "_team._players",
                                        foreignField: "_id",
                                        as: "_team._players",
                                    }
                                },
                                {
                                    $group: {
                                        _id: {_team:"$_team",_player:"$_players"},
                                        _id_doc: { "$first": "$_id" },
                                        _tournament:{$first: "$_tournament"},
                                        team_total: {$first: "$team_total"},
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$_id_doc",
                                        _id_doc: { "$first": "$_id" },
                                        _tournament:{$first: "$_tournament"},
                                        team_total: {$first: "$team_total"},
                                    }
                                },
                                // {$unwind:"$_team._players"},

                            ],
                            function (err, tournaments) {
                                if (err) {
                                    console.log('error grouping teams in Player Ledger ');
                                } else {
                                    console.log(JSON.stringify(tournaments,null,2));
                                }
                            }
                        )
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