'use strict';

const Handlebars = require('handlebars');
const moment = require('moment');

/**
 * Handlebars helper function to format a date string to the format:
 * August 31, 2017 5:19 PM using moment js
 */
Handlebars.registerHelper('formatDate', (dateString) => {
  return moment(new Date(dateString)).format('LLL');
});
