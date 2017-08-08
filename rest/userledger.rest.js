module.exports = function (router, UserLedger) {
    router.route('/userledger')
    //Get all players
        .get(function (req, res) {
            UserLedger.find().populate('user_ID').populate('tournament_ID').populate('team_ID').exec(function (err, team) {
                if (err) {
                    console.log('ERROR GETTING USERLEDGER: ');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING USERLEDGER');
                    res.status(200).json(team);
                }
            });
        })
}
