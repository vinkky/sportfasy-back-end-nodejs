let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let fetch = require('node-fetch');
let cron = require('cron');
let str;
let str1;

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
let last = new Object();
let next;
let job = new cron.CronJob('* * */1 * * ', function () {
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
            }
            else {
                console.log("Nothing to update");
            }
        })
        .catch(err => console.error(err));

    console.log('Data uploaded!');

}, null, true);

module.exports = Race;