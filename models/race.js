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

//Insert DB
Race.count(function (err, count) {
    for (let i=1; i<30; i++) {
        fetch('http://ergast.com/api/f1/' + year + '/' + i + '/results.json')
            .then(res => res.json())
            .then((out) => {
                if (out.MRData.RaceTable.Races[0].season !== undefined && !err && count === 0) {
                    Race.collection.insert(out);
                }

            })
            .catch(err => console.error(err));
    }
});

//Update data every min
let job = new cron.CronJob('*/2 * * * *', function () {
    for (let i=1; i<=30; i++){
        fetch('http://ergast.com/api/f1/' + year + '/' + i + '/results.json')
            .then(res => res.json())
            .then((out) => {
                    Race.collection.update({_id: out._id}, {MRData: out.MRData},{ upsert: true })
            })
            .catch(err => console.error(err));
}
        console.log('Race updated!');
}, null, true);

module.exports = Race;
