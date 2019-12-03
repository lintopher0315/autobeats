const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    numPlays: {
        type: Number,
        required: true
    },
    timePlayed: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)