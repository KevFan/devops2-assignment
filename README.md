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

The project can then be viewed on <http://localhost:4000/>

## User Instructions:
After hosting the project locally, users can signup or login using the preloaded accounts provided: 
```
User Accounts:

email: homer@simpson.com
password: secret

email: marge@simpson.com
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
Alternative for the deployed version, you can visit <link here later>

## List of Software + Technologies Used
* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/) - Node.js Web Framework
* [WebStorm](https://www.jetbrains.com/webstorm/) - JavaScript IDE

## Improvements
* User profile pictures
* Secure the API

## Authors:
Kevin Fan ([KevFan](https://github.com/KevFan))

## Version/Date:
05th November 2017
