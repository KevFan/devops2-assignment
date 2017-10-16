const Accounts = require('./app/controllers/accounts');
const Assets = require('./app/controllers/assets');
const Tweets = require('./app/controllers/tweets');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.home },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'POST', path: '/addTweet', config: Tweets.addTweet },
  { method: 'GET', path: '/global', config: Tweets.globalTimeline },
  { method: 'GET', path: '/deleteSpecificTweet/{id}', config: Tweets.deleteSpecificTweet },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

];
