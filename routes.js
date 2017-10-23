const Accounts = require('./app/controllers/accounts');
const Assets = require('./app/controllers/assets');
const Tweets = require('./app/controllers/tweets');
const Admin = require('./app/controllers/master');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.home },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/register/{role}', config: Accounts.register },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'POST', path: '/addTweet/{userid}', config: Tweets.addTweet },
  { method: 'GET', path: '/global', config: Tweets.globalTimeline },
  { method: 'GET', path: '/deleteSpecificTweet/{userid}/{id}', config: Tweets.deleteSpecificTweet },
  { method: 'GET', path: '/deleteAllUserTweets/{userid}', config: Tweets.deleteAllUserTweets },
  { method: 'GET', path: '/view/{id}', config: Tweets.viewUserTimeline },

  { method: 'GET', path: '/admin', config: Admin.home },
  { method: 'GET', path: '/deleteUser/{id}', config: Admin.deleteUser },
  { method: 'GET', path: '/viewUser/{id}', config: Admin.viewUser },
  { method: 'GET', path: '/deleteAllUserAndTweets', config: Admin.deleteAllUserAndTweets },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];
