module.exports = function (router, TeamPlayers, Team, Player) {
    router.route('/team/players/:team_id?/:player_id?')
        .post(function (req, res) {
            let teamPlayer = new TeamPlayers({
                _team: req.body._team,
                _player: req.body._player,
                is_sold:  req.body.is_sold || false,
                buy_p: req.body.buy_p || 0,
                sell_p: req.body.sell_p || 0
            });
            teamPlayer.save(function (err) {
                if (err) {
                    console.log('ERROR ADDING PLAYERS to Teams: ' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS ADDING PLAYERS to Teams: ');
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

        //Update team
        .put(function (req, res) {
            // update team by name
            const put_querry = {$and:[
                {'_team': req.body._team},
                {'_player': req.body._player},
                {'is_sold':  false }
            ]}

            TeamPlayers.findOne(put_querry).exec(function (err, team) {

                if (err) {
                    console.log('ERROR updating team players, there are no bougth players: ' + err.errmsg);
                    res.status(500).json({error: err});
                    return 0;
                }
                console.log('inside request'+ req.body.sell_p + JSON.stringify(req.body,null,2))
                console.log('inside request 2 '+ JSON.stringify(team,null,2))

                    team.sell_p = req.body.sell_p;
                    team.is_sold = true;
                console.log('AFTER UPDATE '+ JSON.stringify(team,null,2))
                // save team
                team.save(function (err) {
                    if (err) {
                        console.log('ERROR UPDATING TEAM: ' + err);
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS UPDATING team players : ' + team);
                        res.status(200).json({message: 'Team updated!', team:team});
                    }
                });

            });
        })
};