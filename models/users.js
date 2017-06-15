let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: { type: String, required: true,},
    surname: { type: String, required: true,},
    password: { type: String, required: true },
    email: {type: String, required: true, unique: true},
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
userSchema.pre('save', function (next) {
    // get the current date
    let currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

//create model for user
let User = mongoose.model('User', userSchema);

// export model
module.exports = User;