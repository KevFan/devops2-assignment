'use strict';

const assert = require('chai').assert;
const request = require('sync-request');

suite('User API tests', function () {
  // For tests using a seeding model, may be before to drop and re-seed after each test

  test('get users', function () {

    const url = 'http://localhost:4000/api/users';
    const res = request('GET', url);
    const users = JSON.parse(res.getBody('utf8'));

    assert.equal(3, users.length);

    assert.equal(users[0].firstName, 'Homer');
    assert.equal(users[0].lastName, 'Simpson');
    assert.equal(users[0].email, 'homer@simpson.com');
    assert.equal(users[0].password, 'secret');

    assert.equal(users[1].firstName, 'Marge');
    assert.equal(users[1].lastName, 'Simpson');
    assert.equal(users[1].email, 'marge@simpson.com');
    assert.equal(users[1].password, 'secret');

    assert.equal(users[2].firstName, 'Bart');
    assert.equal(users[2].lastName, 'Simpson');
    assert.equal(users[2].email, 'bart@simpson.com');
    assert.equal(users[2].password, 'secret');

  });

  test('get one user', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    let res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    const oneUserUrl = allUsersUrl + '/' + users[0]._id;
    res = request('GET', oneUserUrl);
    const oneUser = JSON.parse(res.getBody('utf8'));

    assert.equal(oneUser.firstName, 'Homer');
    assert.equal(oneUser.lastName, 'Simpson');
    assert.equal(oneUser.email, 'homer@simpson.com');
    assert.equal(oneUser.password, 'secret');

  });

  test('create a user', function () {

    const usersUrl = 'http://localhost:4000/api/users';
    const newUser = {
      firstName: 'Kevin',
      lastName: 'Fan',
      email: 'kevintest@email.com',
      password: 'secret',
    };

    const res = request('POST', usersUrl, { json: newUser });
    const returnedUser = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedUser.firstName, 'Kevin');
    assert.equal(returnedUser.lastName, 'Fan');
    assert.equal(returnedUser.email, 'kevintest@email.com');
    assert.equal(returnedUser.password, 'secret');

  });

  test('update a user', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    let res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    const oneUserUrl = allUsersUrl + '/' + users[0]._id;
    res = request('GET', oneUserUrl);
    let oneUser = JSON.parse(res.getBody('utf8'));

    assert.equal(oneUser.firstName, 'Homer');
    assert.equal(oneUser.lastName, 'Simpson');
    assert.equal(oneUser.email, 'homer@simpson.com');
    assert.equal(oneUser.password, 'secret');

    oneUser.firstName = 'Update';
    const updateUserUrl = allUsersUrl + '/' + oneUser._id;
    res = request('PUT', updateUserUrl, { json: oneUser });
    const returnedUser = JSON.parse(res.getBody('utf8'));
    assert.equal(returnedUser.firstName, 'Update');
    assert.equal(returnedUser.lastName, 'Simpson');
    assert.equal(returnedUser.email, 'homer@simpson.com');
    assert.equal(returnedUser.password, 'secret');

  });

  test('delete a user', function () {

    // Get all the users
    const allUsersUrl = 'http://localhost:4000/api/users';
    const res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    // Test first user name is currently Update Simpson due to put test
    assert.equal(users[0].firstName, 'Update');
    assert.equal(users[0].lastName, 'Simpson');
    assert.equal(users[0].email, 'homer@simpson.com');
    assert.equal(users[0].password, 'secret');

    // Delete the first user - Homer
    const deleteAUserUrl = allUsersUrl + '/' + users[0]._id;
    request('DELETE', deleteAUserUrl);

    // Get new list of all users
    const newAllUserList = JSON.parse(request('GET', 'http://localhost:4000/api/users').getBody('utf8'));

    assert.equal(3, newAllUserList.length);
    assert.equal(newAllUserList[0].firstName, 'Marge');
    assert.equal(newAllUserList[0].lastName, 'Simpson');
    assert.equal(newAllUserList[0].email, 'marge@simpson.com');
    assert.equal(newAllUserList[0].password, 'secret');
  });

  test('delete all users', function () {

    // Get all the users
    const allUsersUrl = 'http://localhost:4000/api/users';
    const res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    // Test first user is currently Marge after deleting Lisa
    assert.equal(users[0].firstName, 'Marge');
    assert.equal(users[0].lastName, 'Simpson');
    assert.equal(users[0].email, 'marge@simpson.com');
    assert.equal(users[0].password, 'secret');

    // Delete all users
    request('DELETE', allUsersUrl);

    // Get new list of all users
    const newListOfUsers = JSON.parse(request('GET', 'http://localhost:4000/api/users').getBody('utf8'));

    assert.equal(0, newListOfUsers.length);
  });
});
