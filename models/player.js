let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let fetch = require('node-fetch');

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

                    Player.collection.insert(obj)
                });

            })
            .catch(err => console.error(err));
    }
});