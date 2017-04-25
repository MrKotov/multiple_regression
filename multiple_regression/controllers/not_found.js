/**
 * not_found.js
 * 
 * @version 0.1
 * @author  Georgi Kotov
 * @updated 2017-04-21
 *
 */

const ROUTER = require('express').Router();
const BODY_PARSER = require('body-parser');
const MATRIX_UTILS = require('../models/matrix_utils');

ROUTER.use(BODY_PARSER.urlencoded({
    extended: true
}));

ROUTER.get('*', (request, response) => {
    return response.sendStatus(404);
});

ROUTER.post('*', (request, response) => {
    return response.sendStatus(404);
});

module.exports = ROUTER;
