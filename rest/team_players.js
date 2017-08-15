module.exports = function (router, TeamPlayers, Team, Player) {
    router.route('/teams/players/:team_id?/:player_id?')
        .post(function (req, res) {
            let teamPlayer = new TeamPlayers({
                _team: req.body.team_id,
                _player: req.body.player_id,
            });
            teamPlayer.save(function (err) {
                if (err) {
                    console.log('ERROR ADDING PLAYERS to Teams: ' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS ADDING PLAYERS to Teams: ' + teamPlayer);
                    res.status(200).json({message: 'SUCCESS ADDING PLAYERS to Teams: ', teamPlayer});
                }
            });
        })
        //returns teams and players by team id or by players id respectively
        .get(function (req, res) {
            let query = function () {
                switch (String(Object.keys(req.query).sort())) {
                    case 'player_id,team_id':
                        return {$and:[
                            {'_team': req.query.team_id},
                            {'_player': req.query.player_id}]};
                        break;
                    case '_team_id':
                        return {'_team': req.query._team_id}
                        break;
                    default:
                        return {};
                }
            }();
            let populateQuery = [
                {path: '_team', populate: [{path: '_team_master'}, {path: '_players'}]},
                {path: '_player'}    ];
            TeamPlayers.find(query).populate(populateQuery).exec(function (err, teamPlayers) {
                if (err) {
                    console.log('ERROR GETTING TEAM PLAYERS: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING TEAM PLAYERS');
                    res.status(200).json(teamPlayers);
                }
            });
        })
};