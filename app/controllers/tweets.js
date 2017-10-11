'use strict';

exports.home = {

  handler: (request, reply) => {
    reply.view('main', { title: 'MyTweet | Home' });
  },

};
