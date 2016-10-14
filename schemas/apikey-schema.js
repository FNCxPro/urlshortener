/**
 * apikey-schema.js
 */
'use strict';
const mongoose = require('mongoose')
const apikeySchema = mongoose.Schema({
    apiKey: {
        type: String,
        required: true
    },
    privileges: {
        type: Number,
        min: 1,
        max: 4,
        required: true
    }
})

module.exports = mongoose.model('apiKey', apikeySchema)
