'use strict';
const User = require('../models/user');
const Tweet = require('../models/tweet');

exports.home = {

  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    let userTweets = null;
    Tweet.find({ tweetUser: userId }).populate('tweetUser').then(allUserTweets => {
      userTweets = allUserTweets;
      console.log('All user tweets:' + allUserTweets);
      return User.findOne({ _id: userId });
    }).then(foundUser => {
      reply.view('dashboard', { title: 'Tweet | Dashboard', tweets: userTweets, user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

