let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let fetch = require('node-fetch');
let cron = require('cron');
let str;
let str1;

let raceSchema = new Schema({
    season:{type: Number},
    round: {type: Number},
    raceName: {type: String},
    date: {type: Date},
    start_time: {type: Number}

});

//create model for player
let Race = mongoose.model('Race', raceSchema);

//API url
let url = 'http://ergast.com/api/f1/current/results.json';

//If DB empty, fetch data

Race.count(function (err, count) {
    if (!err && count === 0) {
        fetch(url)
            .then(res => res.json())
            .then((out) => {
                str = JSON.stringify(out, null, 4); // (Optional) beautiful indented output.
                // console.log(str);
                let info = out.MRData.RaceTable.Races;

                str1 = JSON.stringify(info, null, 4); // (Optional) beautiful indented output.
                // console.log(str1);

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
let job = new cron.CronJob('*/30 * * * *', function () {
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            let info = out.MRData.RaceTable.Races;
            info.forEach((item) => {
                Race.collection.update({season: item.season}, {
                    season: item.season || 0,
                    round: item.round || 0,
                    raceName: item.raceName || 'No race name',
                    date: item.date || 'No date',
                    start_time: item.time || 'No time',
                    results: item.Results || 'No results'
                })
            });
        })
        .catch(err => console.error(err));
    console.log('Data uploaded!');
}, null, true);

module.exports = Race;
