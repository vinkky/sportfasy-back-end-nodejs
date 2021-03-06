module.exports = function (router, PlayersLedger, Team, Player, Tournament) {
    router.route('/tournament/players_ledger/:tournament_id?/:team_id?/:player_id?')
        .post(function (req, res) {
            let playersLedger = new PlayersLedger({
                _tournament: req.body.tournament_id,
                _team: req.body.team_id,
                _player: req.body.player_id,
                _total_income: req.body.total_income,
                _race: req.body.race || null,
            });

            playersLedger.save(function (err) {
                if (err) {
                    console.log('ERROR ADDING Income to Player Ledger: ' + err);
                    res.status(500).json({error: err});
                } else {
                    // console.log('SUCCESS ADDING Income to Player Ledger:: ' + playersLedger);
                    res.status(200).json({message: 'SUCCESS ADDING Income to Player Ledger:', player_ledger: playersLedger});
                }
            });
        })
        //returns teurnaments and teams by team id or by tournament id respectively
        .get(function (req, res) {
            let query = function () {
                switch (String(Object.keys(req.query).sort())) {
                    case 'player_id,team_id,tournament_id':
                        return {
                            $and: [
                                {'_tournament': req.query.tournament_id},
                                {'_team': req.query.team_id},
                                {'_player': req.query.player_id}]
                        };
                        break;
                    case 'team_id':
                        return {'_team': req.query.team_id}
                        break;
                    default:
                        return {}
                        }
            }();
            let populateQuery = [
                {path: '_tournament', populate: {path: '_tournament_master'}},
                {path: '_team', populate: [{path: '_team_master'}, {path: '_players'}]},
                {path: '_player'},
                {path: '_race'}
            ];
            Tournament.find({$and: [{end: {$gte: Date()}}, {start: {$lte: Date()}}]}, function (err, tournaments) {
                       let ids = tournaments.map(function(tournament) { return tournament._id; });
                       PlayersLedger.find({tournament: {$in: ids}}, query).exec(function(err, playersledger) {
                           if (err) {
                               console.log('ERROR GETTING PLAYER LEDGER');
                               res.status(500).json({error: err});
                           } else {
                                playersledger.team.forEach((item)=>{console.log("raceeeee " + item)})
                               console.log('SUCCESS GETTING PLAYER LEDGER');
                               res.status(200).json(playersledger);
                           }
                       });
            })
        })
};