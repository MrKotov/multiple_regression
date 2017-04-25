/**
 * calculate.js
 * Verifies HTTP request methods.
 * Create matrix and calculate its coeffiecients.
 * 
 * @version 0.1
 * @author  Georgi Kotov
 * @updated 2017-04-21
 *
 */
//Express Documentation: https://expressjs.com/en/api.html 
const ROUTER = require('express').Router();
const BODY_PARSER = require('body-parser');
const MATRIX_UTILS = require('../models/matrix_utils');

ROUTER.use(BODY_PARSER.urlencoded({
    extended: false
}));
ROUTER.use(BODY_PARSER.raw({ type: 'application/json' }));

//forbid use of GET method
ROUTER.get('/', (request, response) => {
    return response.status(404).send({ error: 'Get method is not supported.' });
});

//validate POST request input
ROUTER.post('/', (request, response) => {
    response.header('Content-Type', 'application/json');
    var independentDataSet = null;
    var dependentDataSet = null;

    try {
        if (request.header('Content-Type') != 'application/json') {
            return response.status(400).send({ error: 'Content-Type:' + request.header('Content-Type') + ' is not supported.' });
        }

        requestBodyJson = JSON.parse(request.body.toString());

        if (!requestBodyJson[0]) {
            return response.status(400).send({ error: 'Empty request body.' });
        }

        independentDataSet = requestBodyJson[0].independentDataSet;
        dependentDataSet = requestBodyJson[0].dependentDataSet;

        if (!requestBodyJson[0].independentDataSet || !requestBodyJson[0].dependentDataSet) {
            return response.status(400).send({ error: 'Undefined values for dataset' });
        }
    } catch (e) {
        console.log('Error:\n' + e);
        return response.status(400).send({ error: 'Verify your JSON object entries.' });
    }
    
    //lets try to calculate coefficients
    MATRIX_UTILS.createMatrix(independentDataSet)
        .then(
        indepndentMatrix => {
            MATRIX_UTILS.createMatrix(dependentDataSet)
                .then(
                dependentMatrix => {
                    var coefficients = MATRIX_UTILS.calculateCoefficients(indepndentMatrix, dependentMatrix);
                    return response.status(200).send({ result: coefficients._data });
                })
                .catch(
                failure => {
                    return response.status(400).send({ error: failure });
                })
        })
        .catch(
        failure => {
            return response.status(400).send({ error: failure });
        })
});

module.exports = ROUTER;