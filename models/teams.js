let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
const saltRounds = 10;

let teamSchema = new Schema({
    players: {type: String, required: true,},
    master: {type: String, required: true,},
    team_name: {type: String, required: true, unique: true},
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

//create model for team
let Team = mongoose.model('Team', teamSchema);

// export model
module.exports = Team;/**
 * Created by zaidiminis on 6/26/17.
 */
