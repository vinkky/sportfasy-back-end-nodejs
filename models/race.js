let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let fetch = require('node-fetch');
let cron = require('cron');

let TournamentTeam = require('./tournament_teams');
let Player = require('./player');
let Team = require('./teams')
let PlayersLedger = require('./players_ledger');

let raceSchema = new Schema({
    season: {type: Number},
    round: {type: Number},
    raceName: {type: String},
    date: {type: Date},
    start_time: {type: Number}

});

//create model for player
let Race = mongoose.model('Race', raceSchema);
let year = new Date().getFullYear();

//API url
let url = 'http://ergast.com/api/f1/' + year + '/results.json?limit=9000000';

//If DB empty, fetch data

Race.count(function (err, count) {
    if (!err && count === 0) {
        fetch(url)
            .then(res => res.json())
            .then((out) => {
                let info = out.MRData.RaceTable.Races;

                info.forEach((item) => {
                    let obj = {};
                    obj.season = item.season || 0;
                    obj.round = item.round || 0;
                    obj.raceName = item.raceName || 'No race name';
                    obj.date = item.date || 'No date';
                    obj.start_time = item.time || 'No time';
                    obj.results = item.Results || 'No results';

                    Race.collection.insert(obj)
                });

            })
            .catch(err => console.error(err));
    }
});


//Update data every 30 min
let last = new Object();
let next;
let job = new cron.CronJob('*/10 * * * * * ', function () {
    Race.findOne().sort({date: 'descending'}).exec(function (err, race) {
        if (!err) {
            last = race
        } else {
            console.log("No results this season")
        }
    })
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            next = last.round;
            let info = out.MRData.RaceTable.Races[next];
            if (info !== undefined) {
                let obj = {};
                obj.season = info.season || 0;
                obj.round = info.round || 0;
                obj.raceName = info.raceName || 'No race name';
                obj.date = info.date || 'No date';
                obj.start_time = info.time || 'No time';
                obj.results = info.Results || 'No results';

                Race.collection.insert(obj)
                console.log("Data updated");

                Team.collection.find().forEach(function(team) {
                    team._players.forEach(function(Tplayer) {
                        Player.collection.find({_id: Tplayer}).forEach(function (player) {
                            {
                                let obj = {}
                                obj.team = team._id;
                                obj.tournament = team._tournament;
                                obj.player = player;
                                obj.race = info;

                               //console.log(last.results[0][0] + "bjhljl")
                                // for (let i=0; i<last.results.length; i++)
                                // {
                                //     if(last.results[i].Driver.driverId === player.name){
                                //         obj.incomes = (last.results[i].position - player.current_position) * 5000;
                                //     }
                                // }
                                PlayersLedger.collection.insert(obj)
                            }
                        })
                    })

                })

            }
            else if (info !== undefined || last.season < year){
                let obj = {};
                obj.season = out.MRData.RaceTable.Races[0].season || 0;
                obj.round = out.MRData.RaceTable.Races[0].round || 0;
                obj.raceName = out.MRData.RaceTable.Races[0].raceName || 'No race name';
                obj.date = out.MRData.RaceTable.Races[0].date || 'No date';
                obj.start_time = out.MRData.RaceTable.Races[0].time || 'No time';
                obj.results = out.MRData.RaceTable.Races[0].Results || 'No results';

                Race.collection.insert(obj)
            }
            else {
                console.log("Nothing to update");
            }
        })
        .catch(err => console.error(err));
}, null, true);

module.exports = Race;