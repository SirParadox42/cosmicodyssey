const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    createdAt: {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    supernovas: [{type: mongoose.Types.ObjectId, ref: 'User', required: true}],
    blackholes: [{type: mongoose.Types.ObjectId, ref: 'User', required: true}],
});

module.exports = mongoose.model('Post', postSchema);