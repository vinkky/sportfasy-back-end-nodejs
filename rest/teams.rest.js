module.exports = function (router, Team) {
    router.route('/teams')
        .post(function (req, res) {

            let team = new Team({
                players: req.body.players,
                master: req.body.master,
                team_name: req.body.team_name,
                created_at: req.body.created_at,
                updated_at: req.body.updated_at
            });

            // save the team and check for errors
            team.save(function (err) {
                if (err) {
                    console.log('ERROR CREATING TEAM: ' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS CREATING Team: ' + team.team_name);
                    res.status(200).json({message: 'Team created!'});
                }
            });
        })
        //Get all teams
        .get(function (req, res) {
            Team.find(function (err, teams) {
                if (err) {
                    console.log('ERROR GETTING TEAMS: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING TEAMS');
                    res.status(200).json(teams);
                }
            });
        });
    router.route('/teams/:teamName')
    // get team by teamName (accessed at GET http://localhost:3000/api/teams/:teamName)
        .get(function (req, res) {
            Team.find({team_name: req.params.team_name}, function (err, team) {
                if (err) {
                    console.log('ERROR GETTING TEAM: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING TEAM'.green + (' teamName:' + req.params.team_name));
                    res.status(200).json(team);
                }
            });
        });

    router.route('/teams/create')
        .post(function (req, res) {
            Team.findOne({team_name: req.body.team_name}, function (err, team) {
                if (!team) {
                    let team = new Team({
                        players: req.body.players,
                        master: req.body.master,
                        team_name: req.body.team_name,
                        created_at: req.body.created_at,
                        updated_at: req.body.updated_at
                    });
                    // save the team and check for errors
                    team.save(function (err) {
                        if (err) {
                            console.log('ERROR CREATING TEAM: ' + err);
                            res.status(500).json({error: err});
                        } else {
                            console.log('SUCCESS CREATING TEAM: ' + team.team_name);
                            res.status(200).json({message: 'Team created!', team});
                        }
                    });
                } else {
                    console.log('Team with this name eqists'.green);
                    // res.status(200).json(team);
                    res.status(409).json({"message": "Team with this name egists"});
                }
            });
        });


};/**
 * Created by zaidiminis on 6/26/17.
 */
