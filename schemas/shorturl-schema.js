/**
 * shorturl-schema.js
 */
'use strict';
const mongoose = require('mongoose')
const shorturlSchema = mongoose.Schema({
    shortKey: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    reports: {
        type: Number,
        required: false
    }
})

module.exports = mongoose.model('URL', shorturlSchema)