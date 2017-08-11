module.exports = function (router, TournamentTeams, Team, User, Tournament) {
    router.route('/tournament/teams/:_tournament_id?')
        .post(function (req, res) {
            let tournament_teams = new TournamentTeams({
                _tournament: req.body._tournament_id,
                _team: req.body._team_id,
                _team_master: req.body._team_master
            });
            tournament_teams.save(function (err) {
                if (err) {
                    console.log('ERROR ADDING TEAM TO TOURNAMENT: ' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS ADDING TEAM TO TOURNAMENT: ');
                    res.status(200).json({message: 'SUCCESS ADDING TEAM TO TOURNAMEN', tournament_teams});
                }
            });
        })
        //returns teurnaments and teams by team id or by tournament id respectively
        .get(function (req, res) {
            let query = function () {
                switch (String(Object.keys(req.query).sort())) {
                    case 'tournamentID':
                        return {_tournament: req.query.tournamentID};
                        break;
                    case 'teamID':
                        return {_team: req.query.teamID}
                        break;
                    case 'teamMaster':
                        return {_team_master: req.query.teamMaster};
                        break;
                    default:
                        return {};
                }
            }();
            TournamentTeams.find(query).populate('_team').populate('_tournament').populate('_team_master').exec(function (err, tournamentTeams) {
                if (err) {
                    console.log('ERROR GETTING TOURNAMENTS TEAMS: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING TOURNAMENTS TEAMS' + tournamentTeams);
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