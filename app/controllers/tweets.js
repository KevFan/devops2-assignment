'use strict';

exports.home = {

  handler: function (request, reply) {
    reply.view('dashboard', { title: 'Tweet | Dashboard' });
  },

};

