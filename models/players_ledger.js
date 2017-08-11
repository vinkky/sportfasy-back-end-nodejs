let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let playersLedgerSchema = new Schema({
    _tournament: { type: Schema.ObjectId, ref: 'Tournament'},
    _team: { type: Schema.ObjectId, ref: 'Team'},
    _player: { type: Schema.ObjectId, ref: 'Player'},
    _total_income: {type: Number},
    _race: { type: Schema.ObjectId, ref: 'Race'},
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
playersLedgerSchema.pre('save', function (next) {
    // get the current date
    let currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


let PlayersLedger = mongoose.model('PlayersLedger', playersLedgerSchema);

module.exports = PlayersLedger;