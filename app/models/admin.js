'use strict';

const mongoose = require('mongoose');

/**
 * Admin mongoose schema/model
 */
const adminSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
