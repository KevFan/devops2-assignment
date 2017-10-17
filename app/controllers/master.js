const Admin = require('../models/admin');

exports.home = {

  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    Admin.findOne({ _id: userId }).then(foundAdmin => {
      reply.view('adminDashboard', { title: 'Admin Dashboard', admin: foundAdmin });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};
