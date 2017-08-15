let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let teamSchema = new Schema({
    name: {type: String, required: true, unique: true},
    _team_master: {required: true, type: Schema.ObjectId, ref: 'User'},
    _tournament: {type: Schema.ObjectId, ref: 'Tournament'},
    _players: [{type: [Schema.ObjectId], ref: 'Player'}],
    user_points_converted: {type: Boolean},
    total_incomes: {type: Number},
    created_at: Date,
    updated_at: Date
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