const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Events= require('./events')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    events:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Events'
        }
    ]
});
UserSchema.plugin(passportLocalMongoose);       //will add field for username and pass and do basic auth

const User = mongoose.model('User', UserSchema);

module.exports = User;
