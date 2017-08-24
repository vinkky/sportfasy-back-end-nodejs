module.exports = function (router, UserLedger) {
    router.route('/userledger')
    //Get all players
        .get(function (req, res) {
            if (req.query.user_id) {
                UserLedger.aggregate(
                    {$group: {_id: req.query.user_id, sum: {$sum: "$balance"}}}, function (err, user_ledger) {
                        if (err) {
                            console.log('ERROR GETTING USERLEDGER');
                            res.status(500).json({error: err});
                        } else {
                            console.log('SUCCESS GETTING USERLEDGER');
                            res.status(200).json(user_ledger);
                        }
                    });
            }
            else{
                    UserLedger.find({}, function(err, userledger)
                     {
                        if (err) {
                            console.log('ERROR GETTING USERLEDGER');
                           res.status(500).json({error: err});
                        } else {
                            console.log('SUCCESS GETTING USERLEDGER');
                            res.status(200).json(userledger);
                        }
                    })
                }
        })
        .post(function (req, res) {
            let userledger = new UserLedger({
                user_ID: req.body.user_ID,
                balance: req.body.balance,
                team_ID: req.body.team_ID,
                tournament_ID: req.body.tournament_ID
            });
            userledger.save(function (err) {
                if (err) {
                    console.log('ERROR ADDING TEAM TO TOURNAMENT: ' + err);
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS ADDING TEAM TO TOURNAMENT: ' + userledger);
                    res.status(200).json({message: 'SUCCESS ADDING TEAM TO TOURNAMEN', userledger});
                }
            });
        })
}
