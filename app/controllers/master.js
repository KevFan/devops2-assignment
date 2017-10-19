const Admin = require('../models/admin');
const User = require('../models/user');
const Tweet = require('../models/tweet');

exports.home = {

  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    let admin = null;
    Admin.findOne({ _id: userId }).then(foundAdmin => {
      admin = foundAdmin;
      return User.find({});
    }).then(allUsers => {
      reply.view('adminDashboard', { title: 'Admin Dashboard', admin: admin, user: allUsers });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.deleteUser = {

  handler: function (request, reply) {
    const userId = request.params.id;
    Tweet.remove({ tweetUser: userId }).then(success => {
      console.log('Successfully removed all tweets with user id:' + userId);
      return User.remove({ _id: userId });
    }).then(removeUserSuccess => {
      console.log('Successfully user with id:' + userId);
      reply.redirect('/admin');
    }).catch(err => {
      console.log('Something went wrong remove user and associated tweets :(');
      reply.redirect('/admin');
    });
  },
};
