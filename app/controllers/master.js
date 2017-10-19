const Admin = require('../models/admin');
const User = require('../models/user');

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
