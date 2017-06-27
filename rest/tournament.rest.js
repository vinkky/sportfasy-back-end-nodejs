module.exports = function (router, Tournament) {
    router.route('/tournaments')
        .post(function (req, res) {
           let tournament = new Tournament({
                name: req.body.name,
                start: req.body.start,
                end: req.body.end,
                teams: req.body.teams,
                players: req.body.players,
                budget: req.body.budget,
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
                    res.status(200).json({message: 'Tournament created!'});
                }
            });
        })
        //Get all tournaments
        .get(function (req, res) {
            Tournament.find(function (err, tournament) {
                if (err) {
                    console.log('ERROR GETTING TOURNAMENTS: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING TOURNAMENTS');
                    res.status(200).json(tournament);
                }
            });
        });
    //Update tournament
    router.route('/tournaments/update')
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
        });
        //Delete tournament
    router.route('/tournaments/delete')
        .delete(function (req, res) {
            Tournament.remove(
                {name: req.body.name
                }, function (err, tournament) {
                    if (err) {
                        console.log('ERROR DELETING TOURNAMENT: ' + err.errmsg);
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS DELETING TOURNAMENT'+ (' name: ' + req.body.name));
                        res.status(200).json({message: 'Successfully deleted tournament: ' +req.body.name});
                    }
                });
        })
};
