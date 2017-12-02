'use strict';

const Tweet = require('../models/tweet');
const Boom = require('boom');

/**
 * Find all tweets
 */
exports.findAll = {
  auth: false,

  handler: function (request, reply) {
    Tweet.find({}).exec().then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

/**
 * Find one tweet by id
 */
exports.findOne = {
  auth: false,

  handler: function (request, reply) {
    Tweet.findOne({ _id: request.params.id }).then(tweet => {
      reply(tweet);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Find all tweets associated with a userId
 */
exports.findAllUser = {
  auth: false,

  handler: function (request, reply) {
    Tweet.find({ tweetUser: request.params.userid }).then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Create a tweet
 */
exports.create = {
  auth: false,

  handler: function (request, reply) {
    const tweet = new Tweet(request.payload);
    tweet.save().then(newTweet => {
      reply(newTweet).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating tweet'));
    });
  },
};

/**
 * Delete all tweets
 */
exports.deleteAll = {
  auth: false,

  handler: function (request, reply) {
    Tweet.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing tweets'));
    });
  },
};

/**
 * Delete one tweet by id
 */
exports.deleteOne = {
  auth: false,

  handler: function (request, reply) {
    Tweet.remove({ _id: request.params.id }).then(tweet => {
      reply(tweet).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

/**
 * Delete all tweets associated with userId
 */
exports.deleteAllUser = {
  auth: false,

  handler: function (request, reply) {
    Tweet.remove({ tweetUser: request.params.userid }).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing tweets'));
    });
  },
};
