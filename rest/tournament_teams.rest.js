module.exports = function (router, TournamentTeams, Team, User) {
    router.route('/tournament/teams/:userID?/:tournamentMaster?/:tournamentID?')
        .post(function (req, res) {
            let tournament_teams = new TournamentTeams({
                _tournament: req.body._tournament_id,
                _team: req.body._team_id,
            });
            tournament_teams.save(function (err) {
                if (err) {
                    console.log('ERROR ADDING TEAM TO TOURNAMENT: ' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS ADDING TEAM TO TOURNAMENT: ' + tournament_teams);
                    res.status(200).json({message: 'SUCCESS ADDING TEAM TO TOURNAMEN', tournament_teams});
                }
            });
        })
        //returns teurnaments and teams by team id or by tournament id respectively
        .get(function (req, res) {
            let query = function () {
                switch (String(Object.keys(req.query).sort())) {
                    case 'tournamentMaster,userID':
                        return {$and: [{_users: req.query.userID}, {_tournament_master: req.query.tournamentMaster}]};
                        break;
                    case 'teamMaster,userID':
                        return {$and: [{_users: req.query.userID}, {_team_master: req.query.teamMaster}]};
                        break;
                    case 'userID':
                        return {_users: req.query.userID};
                        break;
                    case 'tournamentMaster':
                        return {_tournament_master: req.query.tournamentMaster};
                        break;
                    case 'teamMaster':
                        return {_team_master: req.query._team_master};
                        break;
                    case '_tournament_id':
                        return {'_tournament': req.query._tournament_id};
                        break;
                    case '_team_id':
                        return {'_team': req.query._team_id}
                        break;
                }
            }();
            let populateQuery = [{path: '_tournament',populate: {path: '_users'}, populate: {path: '_tournament_master'}},
                {path: '_team', populate: [{path: '_team_master'}, {path: '_players'}]}
            ];
            TournamentTeams.find(query).populate(populateQuery).exec(function (err, tournamentTeams) {
                if (err) {
                    console.log('ERROR GETTING TOURNAMENTS TEAMS: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING TOURNAMENTS TEAMS');
                    res.status(200).json(tournamentTeams);
                }
            });
        })

        .delete(function (req, res) {
            TournamentTeams.remove({_team_id: req.query._team_id}, function (err, tournament) {
                if (err) {
                    console.log('ERROR DELETING TOURNAMENT TEAMS: ' + err.errmsg);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS DELETING TOURNAMENT TEAMS' + (' name: '));
                    res.status(200).json({message: 'Successfully deleted tournament teams : '});
                }
            });
        });
};