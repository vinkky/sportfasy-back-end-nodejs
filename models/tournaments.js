let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Team = require('./teams');
let User = require('./users');

let tournamentSchema = new Schema({
    name: {type: String, unique: true},
    start: {type: Date,},
    end: {type: Date,},
    max_teams: {type: Number},
    _teams: [{type: [Schema.ObjectId], ref: 'Team'}],
    max_players: {type: Number},
    _users: [{type: [Schema.ObjectId], ref: 'User'}],
    budget: {type: Number},
    _tournament_master: {type: Schema.ObjectId, ref: 'User'},
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
module.exports = tournamentSchema;

