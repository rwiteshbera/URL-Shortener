const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    fullURL : {
        type: String,
        required: true
    },

    uID: {
        type: String,
        require: true
    }
})

const urlData = mongoose.model("urlData", urlSchema);
module.exports = urlData;