'use strict';

const User = require('../models/user');
const Admin = require('../models/admin');
const Joi = require('joi');

/**
 * Sends the main home view
 */
exports.home = {
  auth: false,
  handler: (request, reply) => {
    reply.view('main', { title: 'MyTweet | Home' });
  },
};

/**
 * Sends the sign up view
 */
exports.signup = {
  auth: false,
  handler: (request, reply) => {
    reply.view('signup', { title: 'MyTweet | Sign Up' });
  },
};

/**
 * Sends the login view
 */
exports.login = {
  auth: false,
  handler: (request, reply) => {
    reply.view('login', { title: 'MyTweet | Login' });
  },
};

/**
 * Registers a new user. Form is validated before registering
 */
exports.register = {
  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
  },

  auth: false,
  handler: function (request, reply) {
    const user = new User(request.payload);

    // A role parameter to correctly redirect if a admin adds a user
    const userRole = request.params.role;
    user.save().then(newUser => {
      console.log(newUser);
      if (userRole === 'user') {
        reply.redirect('/login');
      } else if (userRole === 'admin') {
        reply.redirect('/admin');
      }
    }).catch(err => {
      console.log(err);
      reply.redirect('/');
    });
  },
};

/**
 * Authenticate method to validate credentials for a member or admin account. Form is validated
 * before authenticating
 */
exports.authenticate = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Login error',
        errors: error.data.details,
      }).code(400);
    },
  },

  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      // If found user by email and password matches, set cookie and redirect to member dashboard
      if (foundUser && foundUser.password === user.password) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: foundUser._id,
        });
        reply.redirect('/home');
      } else {
        // Otherwise, try finding an admin with the email and password, if successful, set cookie
        // and redirect to admin dashboard. If not, redirect to sign up
        Admin.findOne({ email: user.email }).then(foundAdmin => {
          if (foundAdmin && foundAdmin.password === user.password) {
            request.cookieAuth.set({
              loggedIn: true,
              loggedInUser: foundAdmin._id,
            });
            reply.redirect('/admin');
          } else {
            reply.view('login', { message: 'Email/Password incorrect', messageType: 'negative' });
          }
        });
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/**
 * Logs the current user out, and clears the cookie
 */
exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

/**
 * View setting passing either the admin or member details
 */
exports.viewSettings = {
  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;

    // Find user using userId in cookie
    User.findOne({ _id: userId }).then(foundUser => {
      // If haven't found user, then try finding an admin
      if (!foundUser) {
        Admin.findOne({ _id: userId }).then(foundAdmin => {
          reply.view('settings', {
            title: 'Edit Account Settings',
            user: foundAdmin,
            isAdmin: true,
            role: 'admin',
          });
        });
      } else {
        reply.view('settings', { title: 'Edit Account Settings', user: foundUser, role: 'user' });
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/**
 * Updates an user or admin details - form is validated before trying to update
 */
exports.updateSettings = {
  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      const userId = request.params.userid;
      const role = request.params.role;

      // Try finding user by user Id parameter
      User.findOne({ _id: userId }).then(user => {
        // If no user is found try finding the admin - case where admin is updating own details
        if (!user) {
          Admin.findOne({ _id: userId }).then(admin => {
            reply.view('settings', {
              title: 'Update settings error',
              user: admin,
              isAdmin: true,
              role: 'admin',
              errors: error.data.details,
            }).code(400);
          });
        } else {
          if (role === 'admin') { // If admin is updating a user detail
            let admin = null;
            Admin.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundAdmin => {
              admin = foundAdmin;
              console.log(foundAdmin);
              return User.find({});
            }).then(allUsers => {
              reply.view('adminDashboard', {
                title: 'Update user error',
                admin: admin,
                user: allUsers,
                role: 'user',
                errors: error.data.details,
              }).code(400);
            });
          } else {
            // Other redirect to member settings - case where member is updating own details
            reply.view('settings', {
              title: 'Update settings error',
              user: user,
              role: 'user',
              errors: error.data.details,
            }).code(400);
          }
        }
      });
    },
  },

  handler: function (request, reply) {
    const userId = request.params.userid;
    const role = request.params.role;
    const editedUser = request.payload;

    // Try finding user by userId
    User.findOne({ _id: userId }).then(user => {
      // If we found a user
      if (user) {
        user.firstName = editedUser.firstName;
        user.lastName = editedUser.lastName;
        user.email = editedUser.email;
        user.password = editedUser.password;
        return user.save();
      } // If found no user, throw error to exit current promise chain
      else {
        throw error;
      }
    }).then(user => {
      // Use role to determine where to redirect, if member was updating or admin updating member
      if (role === 'user') {
        reply.view('settings', { title: 'Edit Account Settings', user: user, role: 'user' });
      } else if (role === 'admin') {
        reply.redirect('/admin');
      }
    }).catch(err => {
      // In first error, try to find an admin using the userId
      Admin.findOne({ _id: userId }).then(admin => {
        admin.firstName = editedUser.firstName;
        admin.lastName = editedUser.lastName;
        admin.email = editedUser.email;
        admin.password = editedUser.password;
        return admin.save();
      }).then(admin => {
        reply.view('settings', {
          title: 'Edit Account Settings',
          user: admin,
          isAdmin: true,
          role: 'admin',
        });
      }).catch(err => {
        console.log('no user or admin with id: ' + userId);
        reply.redirect('/');
      });
    });
  },
};
