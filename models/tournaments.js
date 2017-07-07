
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
// let User = mongoose.model('User');
let User = require('./users');

let tournamentSchema = new Schema({
    name: {type: String, required: true, unique: true},
    start: {type: Date, required: true},
    end: {type: Date, required: true},
    max_teams: {type: Number, required: true},
    teams: {type: Array},
    max_players: {type: Number, required: true},
    _players: [{type: [Schema.ObjectId], ref: 'User'}],
    budget: {type: Number, required: true},
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
tournamentSchema.pre('save', function (next) {
    // get the current date
    let currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

//create model for tournament
let Tournament = mongoose.model('Tournament', tournamentSchema);

// export model
module.exports = Tournament;
