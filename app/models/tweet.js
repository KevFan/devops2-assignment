'use strict';

const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  tweetText: String,
  tweetDate: Date,
  tweetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
