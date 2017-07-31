module.exports = function (router, Race) {
    router.route('/race')
    //Get all race
        .get(function (req, res) {
            Race.find(function (err, race) {
                if (err) {
                    console.log('ERROR GETTING RACE');
                    res.status(500).json({error: err});
                } else {
                    console.log('SUCCESS GETTING RACE');
                    res.status(200).json(race);
                }
            });
        })
}
