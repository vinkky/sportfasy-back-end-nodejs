module.exports = function (teams) {

    let PlayersLedger = require('../models/players_ledger');

    let TeamsService = function(teams){
        this.teams = teams;
    }

    TeamsService.prototype.get_team_promise = function (){

        return this.teams.map((team) => {
            return new Promise((resolve, reject) => {

                PlayersLedger.find({'_team': team._id}).exec(function (err, ledger_entries) {
                    if (err) {
                        console.log('ERROR GETTING team incomes in ledger: ');
                    } else {

                        if (ledger_entries.length !== 0) {
                            team.total_incomes = ledger_entries.reduce((sum, entry) => {
                                return sum + entry._total_income
                            }, 0);
                        }
                    }
                }).then(() => {
                    let players_promise = team._players.map((player) => {
                        return new Promise((resolve, reject) => {
                            PlayersLedger.find({$and: [{'_team': team._id}, {'_player': player._id}]}).exec(function (err, ledger_entries) {
                                if (err) {
                                    console.log('ERROR GETTING player incomes in ledger: ');
                                } else {

                                    if (ledger_entries.length !== 0) {
                                        player.total_incomes = ledger_entries.reduce((sum, entry) => {
                                            return sum + entry._total_income
                                        }, 0);
                                        console.log(player);
                                        // console.log(team.name + 'alfa');

                                    }
                                }
                            }).then(() => {
                                resolve()
                            });
                        });

                    });
                    Promise.all(players_promise).then(() => {
                        // console.log(JSON.stringify(teams, null, 2));
                        resolve();
                    });
                });
            });
        });
    }

    return TeamsService;
}