let mongoose = require('mongoose');
let Team = require('./teams');
let User = require('./users');
let Schema = mongoose.Schema;

let userledgerSchema = new Schema({
    user_ID: {required: true, type: Schema.ObjectId, ref: 'User'},
    points: {type: Number},
    team_ID: { type: Schema.ObjectId, ref: 'Team'},
    tournament_ID: { type: Schema.ObjectId, ref: 'Tournament'},
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
userledgerSchema.pre('save', function (next) {
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
let UserLedger = mongoose.model('UserLedger', userledgerSchema);

// export model
module.exports = UserLedger;