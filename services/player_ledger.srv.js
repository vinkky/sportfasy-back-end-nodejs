
module.exports = function(lastRace, players_count){

    let Player = require('../models/player');
    let Team = require('../models/teams');
    let PlayersLedger = require('../models/players_ledger');

    let PlayerLedgerSrv =function(lastRace,players_count){
        this.lastRace = lastRace.ops[0];
        this.players_count = players_count;
        this.base_player_price =1000000;
    }


    PlayerLedgerSrv.prototype.getPlayersPrice = function (position) {

        return this.base_player_price - (this.base_player_price / this.players_count) * (position - 1);
    };

    PlayerLedgerSrv.prototype.countIncomesIncludingPreviousPosition = function (position,
                                                          previous_position) {

        return this.getPlayersPrice(position) * 0.1 * (previous_position - position);

    };

    PlayerLedgerSrv.prototype.insertPlayerIncomes = function () {

        that = this;

        Team.collection.find().forEach(function(team) {
            team._players.forEach(function(Tplayer) {
                Player.collection.find({_id: Tplayer}).forEach(function (player) {
                    {
                        let obj = {}
                        obj._team = team._id;
                        obj._tournament = team._tournament;
                        obj._player = player._id;
                        obj._race = that.lastRace._id;
                        let previous_race_pos = 10;

                        let playersLedger = new PlayersLedger({
                            _tournament:  team._tournament,
                            _team: team._id,
                            _player: player._id,
                            // _total_income: req.body.total_income,
                            _race: that.lastRace._id,
                        });



                        that.lastRace.results.map(result => {
                            if(result.Driver.givenName === player.name){
                                playersLedger._total_income = that.countIncomesIncludingPreviousPosition(player.current_position,previous_race_pos);
                                playersLedger.save(function (err) {
                                    if (err) {
                                        console.log('ERROR ADDING Income to Player Ledger: ' + err);
                                        res.status(500).json({error: err});
                                    } else {
                                        console.log('SUCCESS ADDING Income to Player Ledger:: ' + playersLedger);
                                        res.status(200).json({message: 'SUCCESS ADDING Income to Player Ledger:', playersLedger});
                                    }
                                });
                            }
                        })
                    }
                })
            })

        })
    }
    return PlayerLedgerSrv;
}