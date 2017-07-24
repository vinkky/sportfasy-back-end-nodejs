module.exports = function (router, Player) {
    router.route('/player')
    //Get all players
        .get(function (req, res) {
            Player.find(function (err, player) {
                if (err) {
                    console.log('ERROR GETTING PLAYERS');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING PLAYERS');
                    res.status(200).json(player);
                }
            });
        })
}
