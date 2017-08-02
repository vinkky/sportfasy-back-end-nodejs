let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tournamentTeamsSchema = new Schema({
    _tournament: { type: Schema.ObjectId, ref: 'Tournament'},
    _team: { type: Schema.ObjectId, ref: 'Team'},
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
tournamentTeamsSchema.pre('save', function (next) {
    // get the current date
    let currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

tournamentTeamsSchema.index( { '_team': 1 },{unique: true} );

let TournamentTeams = mongoose.model('TournamentTeams', tournamentTeamsSchema);

module.exports = TournamentTeams;