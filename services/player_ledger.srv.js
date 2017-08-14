
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

        console.log(this.lastRace._id);
        that = this;

        Team.collection.find().forEach(function(team) {
            team._players.forEach(function(Tplayer) {
                Player.collection.find({_id: Tplayer}).forEach(function (player) {
                    {
                        let obj = {}
                        obj.team = team._id;
                        obj.tournament = team._tournament;
                        obj.player = player._id;
                        obj.race = that.lastRace._id;
                        let previous_race_pos = 10;

                        that.lastRace.results.map(result => {
                            if(result.Driver.givenName === player.name){
                                obj.incomes = that.countIncomesIncludingPreviousPosition(player.current_position,previous_race_pos)
                            }
                        })
                        PlayersLedger.collection.insert(obj);
                    }
                })
            })

        })
    }
    return PlayerLedgerSrv;
}