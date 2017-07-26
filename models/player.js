let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let fetch = require('node-fetch');
let cron = require('cron');

let playerSchema = new Schema({
    name: {type: String},
    surname: {type: String},
    age: {type: Number},
    nationality: {type: String},
    real_team: {type: String},
    eff_points: {type: Number},
    price: {type: Number}
});

//create model for player
let Player = mongoose.model('Player', playerSchema);

//API url
let url = 'http://ergast.com/api/f1/current/last/results.json';

//If DB empty, fetch data
Player.count(function (err, count) {
    if (!err && count === 0) {
        fetch(url)
            .then(res => res.json())
            .then((out) => {
                let info = out.MRData.RaceTable.Races[0].Results;
                info.forEach((item) => {
                    let obj = {};
                    obj.name = item.Driver.givenName || 'No name';
                    obj.surname = item.Driver.familyName || 'No surname';
                    obj.age = item.Driver.dateOfBirth || 0;
                    obj.nationality = item.Driver.nationality || 'No nationality';
                    obj.real_team = item.Constructor.constructorId || 'No team';
                    obj.eff_points = item.points || -1

                    Player.collection.insert(obj)
                });

            })
            .catch(err => console.error(err));
    }
});

//Update data every 30 min
let job = new cron.CronJob('*/1 * * * *', function () {
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            let info = out.MRData.RaceTable.Races[0].Results;
            info.forEach((item) => {
                Player.collection.update({name: item.Driver.givenName}, {
                    name: item.Driver.givenName || 'No name',
                    surname: item.Driver.familyName || 'No surname',
                    age: item.Driver.dateOfBirth || 0,
                    nationality: item.Driver.nationality || 'No nationality',
                    real_team: item.Constructor.constructorId || 'No team',
                    eff_points: item.points || -1,
                    price: 100
                })
            });
        })
        .catch(err => console.error(err));
    console.log('Data uploaded!');
}, null, true);

module.exports = Player;
