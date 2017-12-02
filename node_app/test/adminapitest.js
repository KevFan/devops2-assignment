'use strict';

const assert = require('chai').assert;
const request = require('sync-request');

suite('Admin API tests', function () {
  // For tests using a seeding model, may be before to drop and re-seed after each test

  test('get admins', function () {

    const url = 'http://localhost:4000/api/admins';
    const res = request('GET', url);
    const admins = JSON.parse(res.getBody('utf8'));

    assert.equal(2, admins.length);

    assert.equal(admins[0].firstName, 'Admin');
    assert.equal(admins[0].lastName, 'Simpson');
    assert.equal(admins[0].email, 'admin@simpson.com');
    assert.equal(admins[0].password, 'secret');

    assert.equal(admins[1].firstName, 'Grandpa');
    assert.equal(admins[1].lastName, 'Simpson');
    assert.equal(admins[1].email, 'grandpa@simpson.com');
    assert.equal(admins[1].password, 'secret');

  });

  test('get one admin', function () {

    const allAdminsUrl = 'http://localhost:4000/api/admins';
    let res = request('GET', allAdminsUrl);
    const admins = JSON.parse(res.getBody('utf8'));

    const oneAdminUrl = allAdminsUrl + '/' + admins[0]._id;
    res = request('GET', oneAdminUrl);
    const oneAdmin = JSON.parse(res.getBody('utf8'));

    assert.equal(oneAdmin.firstName, 'Admin');
    assert.equal(oneAdmin.lastName, 'Simpson');
    assert.equal(oneAdmin.email, 'admin@simpson.com');
    assert.equal(oneAdmin.password, 'secret');

  });

  test('create an admin', function () {

    const adminsUrl = 'http://localhost:4000/api/admins';
    const newAdmin = {
      firstName: 'Kevin',
      lastName: 'Fan',
      email: 'kevintest@email.com',
      password: 'secret',
    };

    const res = request('POST', adminsUrl, { json: newAdmin });
    const returnedAdmin = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedAdmin.firstName, 'Kevin');
    assert.equal(returnedAdmin.lastName, 'Fan');
    assert.equal(returnedAdmin.email, 'kevintest@email.com');
    assert.equal(returnedAdmin.password, 'secret');

  });

  test('update an admin', function () {

    const allAdminsUrl = 'http://localhost:4000/api/admins';
    let res = request('GET', allAdminsUrl);
    const admins = JSON.parse(res.getBody('utf8'));

    const oneAdminUrl = allAdminsUrl + '/' + admins[0]._id;
    res = request('GET', oneAdminUrl);
    const oneAdmin = JSON.parse(res.getBody('utf8'));

    assert.equal(oneAdmin.firstName, 'Admin');
    assert.equal(oneAdmin.lastName, 'Simpson');
    assert.equal(oneAdmin.email, 'admin@simpson.com');
    assert.equal(oneAdmin.password, 'secret');

    oneAdmin.firstName = 'Update';
    const updateUserUrl = allAdminsUrl + '/' + oneAdmin._id;
    res = request('PUT', updateUserUrl, { json: oneAdmin });
    const returnedUser = JSON.parse(res.getBody('utf8'));
    assert.equal(returnedUser.firstName, 'Update');
    assert.equal(returnedUser.lastName, 'Simpson');
    assert.equal(returnedUser.email, 'admin@simpson.com');
    assert.equal(returnedUser.password, 'secret');

  });

  test('delete an admin', function () {

    // Get all the users
    const allAdminsUrl = 'http://localhost:4000/api/admins';
    const res = request('GET', allAdminsUrl);
    const admins = JSON.parse(res.getBody('utf8'));

    // Test first user name is currently Update Simpson due to put test
    assert.equal(admins[0].firstName, 'Update');
    assert.equal(admins[0].lastName, 'Simpson');
    assert.equal(admins[0].email, 'admin@simpson.com');
    assert.equal(admins[0].password, 'secret');

    // Delete the first user - Homer
    const deleteAnAdminUrl = allAdminsUrl + '/' + admins[0]._id;
    request('DELETE', deleteAnAdminUrl);

    // Get new list of all users
    const newAllAdminList = JSON.parse(request('GET', allAdminsUrl).getBody('utf8'));

    // Should have 2 admins remaining due to one created at post test
    assert.equal(2, newAllAdminList.length);
    assert.equal(newAllAdminList[0].firstName, 'Grandpa');
    assert.equal(newAllAdminList[0].lastName, 'Simpson');
    assert.equal(newAllAdminList[0].email, 'grandpa@simpson.com');
    assert.equal(newAllAdminList[0].password, 'secret');
  });

  test('delete all admins', function () {

    // Get all the admins
    const allAdminsUrl = 'http://localhost:4000/api/admins';
    const res = request('GET', allAdminsUrl);
    const admins = JSON.parse(res.getBody('utf8'));

    // Test first admin is currently Grandpa after deleting Admin
    assert.equal(admins[0].firstName, 'Grandpa');
    assert.equal(admins[0].lastName, 'Simpson');
    assert.equal(admins[0].email, 'grandpa@simpson.com');
    assert.equal(admins[0].password, 'secret');

    // Delete all admins
    request('DELETE', allAdminsUrl);

    // Get new list of all admins
    const newListOfAdmins = JSON.parse(request('GET', allAdminsUrl).getBody('utf8'));

    assert.equal(0, newListOfAdmins.length);
  });
});
