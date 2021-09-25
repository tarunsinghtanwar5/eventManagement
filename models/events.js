const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    }
});

const Events = mongoose.model('Events', UserSchema);

module.exports = Events;
