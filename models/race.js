let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let fetch = require('node-fetch');
let cron = require('cron');

let Player = require('./player');
let Team = require('./teams');
let PlayersLedger = require('./players_ledger');
let PlayerLedgerSrv =  require('../services/player_ledger.srv')();

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
                let last_race = out.MRData.RaceTable.Races;

                last_race.forEach((item) => {
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
let previous_race = new Object();
let next;
let job = new cron.CronJob('* */60 * * * * ', function () {
    Race.findOne().sort({date: 'descending'}).exec(function (err, race) {
        if (!err) {
            previous_race = race
        } else {
            console.log("No results this season")
        }
    })
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            next = previous_race.round;
            let last_race = out.MRData.RaceTable.Races[next];
            if (last_race !== undefined) {
                let obj = {};
                obj.season = last_race.season || 0;
                obj.round = last_race.round || 0;
                obj.raceName = last_race.raceName || 'No race name';
                obj.date = last_race.date || 'No date';
                obj.start_time = last_race.time || 'No time';
                obj.results = last_race.Results || 'No results';

               let inserted_race= Race.collection.insert(obj).then(inserted => {
                   Player.count(function (err, players_count) {
                       new PlayerLedgerSrv(inserted,players_count).insertPlayerIncomes();
                   });


               });
                console.log("Data updated");
            }
            else if (last_race !== undefined || previous_race.season < year){
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