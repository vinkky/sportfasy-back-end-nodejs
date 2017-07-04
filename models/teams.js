let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('../models/users');
let Tournament = require('../models/tournaments');

let teamSchema = new Schema({
    name: {type: String, required: true, unique: true},
    master: {type: String, required: true},
    players: {type: String, required: true},
    created_at: Date,
    updated_at: Date,
    creator: {
        name: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
});

// on every save, add the date
teamSchema.pre('save', function (next) {
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
let Team = mongoose.model('Team', teamSchema);

// export model
module.exports = Team;