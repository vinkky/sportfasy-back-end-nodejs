module.exports = function (router, Team) {
    router.route('/teams')
        .post(function (req, res) {
            let team = new Team({
                name: req.body.name,
                master: req.body.master,
                players: req.body.players,
                created_at: req.body.created_at,
                updated_at: req.body.updated_at
            });

            // save the team and check for errors
            team.save(function (err) {
                if (err) {
                    console.log('ERROR CREATING TEAM: ' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS CREATING TEAM: ' + team.name);
                    res.status(200).json({message: 'Team created!'});
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
        });
    //Update team
    router.route('/teams/update')
        .put(function (req, res) {
            // update team by name
            Team.findOne({name: req.body.name}, function (err, team) {

                if (err) {
                    console.log('ERROR UPDATING TEAM: ' + err.errmsg);
                    res.status(500).json({error: err});
                    return 0;
                }

                for (var key in req.body) {
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
        });
    //Delete team
    router.route('/teams/delete')
        .delete(function (req, res) {
            Team.remove(
                {name: req.body.name
                }, function (err, team) {
                    if (err) {
                        console.log('ERROR DELETING TEAM: ' + err.errmsg);
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS DELETING TEAM'+ (' name: ' + req.body.name));
                        res.status(200).json({message: 'Successfully deleted team: ' +req.body.name});
                    }
                });
        })
};