module.exports = function (teams) {

    let PlayersLedger = require('../models/players_ledger');

    let TeamsService = function(teams){
        this.teams = teams;
    }

    TeamsService.prototype.get_teams_total = function (){

        let teams_incomes_promises =  this.teams.map((team) => {
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
                        resolve();
                    }
                })
            });
        });

        Promise.all(teams_incomes_promises).then(() => {
            console.log(JSON.stringify(this.teams, null, 2));
            // resolve(this.teams);
        });

    }

    return TeamsService;
}

