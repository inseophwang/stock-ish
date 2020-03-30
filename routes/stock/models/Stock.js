const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StockSchema = new Schema({
    name: {type: String},
    price: {type: Number}
})

module.exports = mongoose.model('Stock', StockSchema)