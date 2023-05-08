const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const readerSessionSchema = mongoose.Schema({
    reader_id : {
        type: Schema.Types.ObjectId,
        required: true
    },
    reading_duration: {
        type: Number,
        required: true
    },
    session_date: {
        type: String, 
        required: true
    }
});

module.exports = mongoose.model('ReaderSession', readerSessionSchema);
 