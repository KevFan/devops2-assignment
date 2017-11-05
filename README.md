# MyTweet Hapi

This project is a Microblog/twitter like web application built using the Hapi framework. Users can sign up to the application to write tweets of max 140 characters, view a global timeline of tweets and other users. 

## Features
* Users
  * Create, read and delete tweets
  * View global timeline of tweets 
  * View profile and tweets of another user
* Admin
  * Create, read, update and delete user and tweets
* Seperate REST API
  * Tweets API
    * Find all, find one by id and find all associated with user id
    * Delete all, delete one by id and delete all associated with user id
    * Create tweet
  * Users API
    * Find one by id and find all users
    * Delete one by id and delete all users
    * Update one user by id
    * Create user
  * Admin API
    * Find one by id and find all admins
    * Delete one by id and delete all admins
    * Update one admin by id
    * Create admin

## Pre-requisites

To get started, you'll need to have the following requirements installed

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/en/)
* npm (Installed with Node.js)
* [MongoDB 2.6.x / 3.2.x](https://docs.mongodb.com/manual/administration/install-community/)

## Getting started
	
	# Ensure `mongod` is running, either as a service or in another shell
	git clone <this repo>
	npm install
	npm start

These commands would host the project locally and seed the database with default data.
The project can then be viewed on <http://localhost:4000/>

## Running tests

Endpoints of the API are tested using mocha/chai.
To run tests enter:
 ```
 # Ensure the project is hosted locally and database seeded (see getting started)
 # Open another terminal
 npm test

 ```

Mochawesome test reports are also generated and included which can be found in the project directory:

```
myTweet-enterprise-web/mochawesome-report/mochawesome.html
```

## User Instructions:
After hosting the project locally, users can signup or login using the preloaded accounts provided: 
```
User Accounts:

email: homer@simpson.com
password: secret

email: marge@simpson.com
password: secret

email: bart@simpson.com
password: secret
```
There is also a preloaded admin accounts that can delete users and tweets 
```
Admin Account:

email: admin@simpson.com
password: secret

email: granda@simpson.com
password: secret
```

Alternative for the deployed version, you can visit <https://mytweet-ent.herokuapp.com/>. The above default accounts can also be used to log in the deployed version if they have not been deleted.

## List of Software + Technologies Used
* [Node.js](https://nodejs.org/en/) - JavaScript runtime
* [MongoDB 2.6.x / 3.2.x](https://docs.mongodb.com/manual/administration/install-community/) / [Mlab](https://mlab.com/welcome/) - document database
* [Hapi](https://hapijs.com/) - Node.js Web Framework
* [mochawesome](https://www.npmjs.com/package/mochawesome) - Testing report
* [Mocha](https://mochajs.org/) - JavaScript test framework
* [Heroku](https://dashboard.heroku.com/) - Deployment platform
* [WebStorm](https://www.jetbrains.com/webstorm/) - JavaScript IDE

## Improvements
* Add user profile pictures
* Secure the API - by knowing the endpoints, anyone can create, find, delete and update to the database. This includes deleting users and creating new admins etc.
* Should seed the database before each test suit so that each test are independant of each other, and improve user friendliness of test command by not having to open two terminals


## Authors:
Kevin Fan ([KevFan](https://github.com/KevFan))

## Version/Date:
05th November 2017
