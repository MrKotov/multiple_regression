/**
 * index.js
 * Define which controller to be used 
 * 
 * @version 0.1
 * @author  Georgi Kotov
 * @updated 2017-04-21
 *
 */
const ROUTER = require('express').Router();


ROUTER.use('/calculate', require('./calculate'));
ROUTER.use('*', require('./not_found'));

module.exports = ROUTER;
