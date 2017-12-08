# DevOps Assignment 2

This repository contains code used in assignment 2 of Developer Operations module 

## Node App
The node app used for EC2 deployment was the [MyTweet](https://github.com/KevFan/myTweet-enterprise-web) web application for assignment 1 of Enterprise Web Development. 

However, there were some additions added including:
* Display of Public IP on application main view
* Display of server hostname on application main view
* Route addition for testing load balancing  

## Scripts
Several scripts are also included that are to be used locally.

* curl.sh
  * Bash script used to curl the load balancer DNS for 100 requests
* curlTrue.sh
  * Bash script used to constantly curl the load balancer DNS
* monitor.py
  * Python3 script used to monitor EC2 instances.
    * Allows getting the CloudWatch data points based on a selected metric and statistic type from the past 100 minutes in 5 minute periods
    * Data points returned are sorted by the data point timestamps
* utils.py
  * Stripped down version of utils.py used in [DevOps Assignment 1](https://github.com/KevFan/devOps_assign1)

## Authors:
Kevin Fan ([KevFan](https://github.com/KevFan))

## Version/Date:
04th December 2017