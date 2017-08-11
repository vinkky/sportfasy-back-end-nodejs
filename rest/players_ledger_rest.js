'use strict';
module.exports = function (router, PlayersLedger, Team, Player, Tournament) {
    router.route('/tournament/players_ledger/:tournament_id?/:team_id?/:player_id?')
        .post(function (req, res) {
            let populateQuery = [
                {path: '_tournament', match: {type: start}, populate: {path: '_tournament_master'}},
                {path: '_team', populate: [{path: '_team_master'}, {path: '_players'}]},
                {path: '_player'},
                {path: '_race'}
            ];
            let playersLedger = new PlayersLedger({
                _tournament: req.body.tournament_id,
                _team: req.body.team_id,
                _player: req.body.player_id,
                _total_income: req.body.total_income,
                _race: req.body.race,
            });

            playersLedger.save(function (err) {
                if (err) {
                    console.log('ERROR ADDING Income to Player Ledger: ' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS ADDING Income to Player Ledger:: ' + playersLedger);
                    res.status(200).json({message: 'SUCCESS ADDING Income to Player Ledger:', playersLedger});
                }
            });
            PlayersLedger.find({}).populate(populateQuery).exec(function (err, tournamentTeams){});
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
                    case '_team_id':
                        return {'_team': req.query._team_id}
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

                PlayersLedger.find({}).populate(populateQuery).exec(function (err, playersledger){
                    if (err) {
                        console.log('ERROR GETTING PLAYERS LEDGER');
                        res.status(500).json({error: err});
                    } else {
                        console.log('SUCCESS GETTING PLAYERS LEDGER');
                        res.status(200).json(playersledger);
                    }

                })
        })
        //     Tournament.find({$and: [{end: {$gte: Date()}}, {start: {$lte: Date()}}]}).populate({path: '_tournament_master'}).exec(function (err, tournament) {
        //         if(err){
        //             res.status(500).json({error: err})
        //         }
        //         else{
        //             (()=>{
        //                 let arr = [];
        //                 let itemsProcessed = 0;
        //                 tournament.forEach((tournament,index,tournaments) => {
        //                     PlayersLedger.find({_tournament: tournament._id}).populate(populateQuery).exec(function (err, tournamentTeams) {
        //                         if (err) {
        //                             console.log('ERROR GETTING TOURNAMENTS TEAMS: ');
        //                             res.status(500).json({error: err});
        //                         } else {
        //                             itemsProcessed++;
        //                             if(itemsProcessed === tournaments.length ) {
        //                                 console.log('SUCCESS GETTING TOURNAMENTS TEAMS');
        //                                 res.status(200).json(arr);
        //                             }
        //                             arr.push(tournamentTeams);
        //                             console.log(arr);
        //                         }
        //                     });
        //                 });
        //
        //             })();
        //
        //             //     .then(arr =>{
        //             //     console.log('SUCCESS GETTING TOURNAMENTS TEAMS');
        //             //     res.status(200).json(arr);
        //             //     }
        //             // );
        //
        //
        //
        //
        //
        //
        //         }
        //     })
        // })
};