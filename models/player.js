let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var fetch = require('node-fetch');

let playerSchema = new Schema({
    name: {type: String},
    surname: {type: String},
    age: {type: Number},
    nationality: {type: String},
    real_team: {type: String},
    fantasy_team: {type: String},
    eff_points: {type: Number},
    price: {type: Number}
});

//create model for player
let Player = mongoose.model('Player', playerSchema);
let url = 'http://ergast.com/api/f1/current/last/results.json';

Player.count(function (err, count) {
    if (!err && count === 0) {
        fetch(url)
            .then(res => res.json())
            .then((out) => {
                let info = out.MRData.RaceTable.Races[0].Results;
                info.forEach((item) => {
                    obj = new Object();
                    obj.name = item.Driver.givenName;
                    obj.surname = item.Driver.familyName;
                    obj.age = item.Driver.dateOfBirth;
                    obj.nationality = item.Driver.nationality;
                    obj.real_team = item.Constructor.constructorId;

                    Player.collection.insert(obj)
                });

            })
            .catch(err => console.error(err));
    }
});

// on every save, add the date
playerSchema.pre('save', function (next) {
    // get the current date
    let currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

// export model
module.exports = Player;