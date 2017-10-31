'use strict';

const assert = require('chai').assert;
const request = require('sync-request');

suite('Tweet API tests', function () {
  // For tests using a seeding model, may be before to drop and re-seed after each test

  test('get tweets', function () {
    const url = 'http://localhost:4000/api/tweets';
    const res = request('GET', url);
    const tweets = JSON.parse(res.getBody('utf8'));

    assert.equal(3, tweets.length);
    assert.equal(tweets[0].tweetText, 'First Tweet Test');
    assert.equal(tweets[0].tweetDate, '2017-07-31T22:04:00.000Z');
    assert.equal(tweets[1].tweetText, 'Second Tweet Test');
    assert.equal(tweets[1].tweetDate, '2017-08-31T16:19:00.000Z');
    assert.equal(tweets[2].tweetText, 'Third Tweet Test');
    assert.equal(tweets[2].tweetDate, '2017-09-16T20:54:00.000Z');
  });

  test('get one tweet', function () {

    const allTweetsUrl = 'http://localhost:4000/api/tweets';
    let res = request('GET', allTweetsUrl);
    const tweets = JSON.parse(res.getBody('utf8'));

    const oneTweetUrl = allTweetsUrl + '/' + tweets[0]._id;
    res = request('GET', oneTweetUrl);
    const oneTweet = JSON.parse(res.getBody('utf8'));

    assert.equal(oneTweet.tweetText, 'First Tweet Test');
    assert.equal(oneTweet.tweetDate, '2017-07-31T22:04:00.000Z');
  });

  test('get all user tweets', function () {
    const allUsersUrl = 'http://localhost:4000/api/users';
    let res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    const allUserTweetsUrl = 'http://localhost:4000/api/tweets/users/' + users[0]._id;
    res = request('GET', allUserTweetsUrl);
    const tweets = JSON.parse(res.getBody('utf8'));

    assert.equal(2, tweets.length);
    assert.equal(tweets[0].tweetText, 'First Tweet Test');
    assert.equal(tweets[0].tweetDate, '2017-07-31T22:04:00.000Z');
    assert.equal(tweets[0].tweetUser, users[0]._id);
    assert.equal(tweets[1].tweetText, 'Second Tweet Test');
    assert.equal(tweets[1].tweetDate, '2017-08-31T16:19:00.000Z');
    assert.equal(tweets[1].tweetUser, users[0]._id);
  });

  test('create a tweet', function () {

    const tweetsUrl = 'http://localhost:4000/api/tweets';
    const newTweet = {
      tweetText: 'Testing Api',
      tweetDate: '2017-11-01T11:07:00.000Z',
    };

    const res = request('POST', tweetsUrl, { json: newTweet });
    const returnedTweet = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedTweet.tweetText, 'Testing Api');
    assert.equal(returnedTweet.tweetDate, '2017-11-01T11:07:00.000Z');
  });

  test('delete a tweet', function () {

    const allTweetsUrl = 'http://localhost:4000/api/tweets';
    let res = request('GET', allTweetsUrl);
    const tweets = JSON.parse(res.getBody('utf8'));

    // Should have 4 tweets after creating one in post test
    assert.equal(4, tweets.length);
    assert.equal(tweets[0].tweetText, 'First Tweet Test');
    assert.equal(tweets[0].tweetDate, '2017-07-31T22:04:00.000Z');

    // Delete the first tweet
    const deleteATweetUrl = allTweetsUrl + '/' + tweets[0]._id;
    request('Delete', deleteATweetUrl);

    // New list of all tweets after delete
    const newAllTweetList = JSON.parse(request('GET', allTweetsUrl).getBody('utf8'));
    assert.equal(3, newAllTweetList.length);
    assert.equal(newAllTweetList[0].tweetText, 'Second Tweet Test');
    assert.equal(newAllTweetList[0].tweetDate, '2017-08-31T16:19:00.000Z');
  });

  test('delete all user tweets', function () {
    // Get all users
    const allUsersUrl = 'http://localhost:4000/api/users';
    let res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    // Get all tweets of homer id - should have 1 left due to 1 being deleted in delete test above
    const allUserTweetsUrl = 'http://localhost:4000/api/tweets/users/' + users[0]._id;
    res = request('GET', allUserTweetsUrl);
    const tweets = JSON.parse(res.getBody('utf8'));

    assert.equal(1, tweets.length);
    assert.equal(tweets[0].tweetText, 'Second Tweet Test');
    assert.equal(tweets[0].tweetDate, '2017-08-31T16:19:00.000Z');
    assert.equal(tweets[0].tweetUser, users[0]._id);

    request('DELETE', allUserTweetsUrl);

    res = request('GET', allUserTweetsUrl);
    const afterDeleteTweets = JSON.parse(res.getBody('utf8'));

    assert.equal(0, afterDeleteTweets.length);
  });

  test('delete all tweets', function () {
    const url = 'http://localhost:4000/api/tweets';
    const res = request('GET', url);
    const tweets = JSON.parse(res.getBody('utf8'));

    // Should have 2 left due to delete tests and post test
    assert.equal(2, tweets.length);
    assert.equal(tweets[0].tweetText, 'Third Tweet Test');
    assert.equal(tweets[0].tweetDate, '2017-09-16T20:54:00.000Z');

    // Delete all tweets
    request('DELETE', url);

    // Get new list of all tweets
    const newListOfTweets = JSON.parse(request('GET', url).getBody('utf8'));

    assert.equal(0, newListOfTweets.length);
  });
});
