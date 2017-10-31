const UsersApi = require('./app/api/usersapi');
const TweetsApi = require('./app/api/tweetssapi');

module.exports = [
  { method: 'GET', path: '/api/users', config: UsersApi.find },
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
  { method: 'POST', path: '/api/users', config: UsersApi.create },
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },
  { method: 'PUT', path: '/api/users/{id}', config: UsersApi.update },

  { method: 'GET', path: '/api/tweets', config: TweetsApi.findAll },
  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
  { method: 'POST', path: '/api/tweets', config: TweetsApi.create },
  { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne },
  { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll },
  { method: 'GET', path: '/api/tweets/users/{userid}', config: TweetsApi.findAllUser },
  { method: 'DELETE', path: '/api/tweets/users/{userid}', config: TweetsApi.deleteAllUser },
];
