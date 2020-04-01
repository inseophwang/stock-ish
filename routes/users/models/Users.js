const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {type: String,  lowercase: true},
    email: {type: String, unique: true,  lowercase: true},
    password: {type: String},
    watchList: [
        {
            companyName: String,
            price: Number
    }]
})

module.exports = mongoose.model('user', UserSchema)