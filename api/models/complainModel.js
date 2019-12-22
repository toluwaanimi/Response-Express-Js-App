const mongoose = require('mongoose');
const complainSchema = mongoose.Schema({
    subjectImage: {type: String, required: true},
    subjectHeading: {type: String, required: true},
    subjectMessage: {type: String, required: true},
    subjectEmail: {type: String, required: true},
    subjectStatus: {type: Boolean, default: false}
});

module.exports = mongoose.model('Complain', complainSchema);
