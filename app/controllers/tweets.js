'use strict';
const User = require('../models/user');
const Tweet = require('../models/tweet');

exports.home = {

  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    let userTweets = null;
    Tweet.find({ tweetUser: userId }).populate('tweetUser').then(allUserTweets => {
      userTweets = allUserTweets;
      // console.log('All user tweets:' + allUserTweets);
      return User.findOne({ _id: userId });
    }).then(foundUser => {
      reply.view('dashboard', { title: 'Tweet | Dashboard', tweets: userTweets, user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.addTweet = {

  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    let tweetData = request.payload;
    tweetData.tweetUser = userId;
    console.log(tweetData);
    Tweet.create(tweetData).then(newTweet => {
      reply.redirect('/home');
    }).catch(err => {
      console.log('Tried to add tweet but Something went wrong :(');
      reply.redirect('/home');
    });
  },
};

exports.globalTimeline = {

  handler: function (request, reply) {
    Tweet.find({}).populate('tweetUser').then(allTweets => {
      reply.view('globalTimeLine', { tweets: allTweets });
    }).catch(err => {
      console.log('Tried to get all tweets but Something went wrong :(');
      reply.redirect('/home');
    });
  },
};
