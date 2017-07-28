module.exports = function (router, TournamentTeams, Team) {
    router.route('/tournament/teams/:tournamentID?')
        .post(function (req, res) {
            let tournament_teams = new TournamentTeams({
                _tournament_id: req.body._tournament_id,
                _team_id: req.body._team_id,
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
                    case '_tournament_id':
                        return {'_tournament_id': req.query._tournament_id};
                        break;
                    case '_team_id':
                        return {'_team_id': req.query._team_id}
                        break;
                    default:
                        null;
                }
            }();
            TournamentTeams.find(query).populate('_tournament_id').populate('_team_id').exec(function (err, tournament) {
                if (err) {
                    console.log('ERROR GETTING TOURNAMENTS TEAMS: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING TOURNAMENTS TEAMS');
                    res.status(200).json(tournament);
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