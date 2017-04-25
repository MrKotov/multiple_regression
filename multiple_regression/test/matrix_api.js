/**
 * matrix_api.js
 * Integrational and functional testing.
 * 
 * @version 0.1
 * @author  Georgi Kotov
 * @updated 2017-04-21
 *
 */
//Chai Documentation: http://chaijs.com/guide/
const CHAI = require('chai');
const CHAI_HTTP = require('chai-http');
const APP = require('../index');

CHAI.use(CHAI_HTTP);

const expect = CHAI.expect;
const should = CHAI.should;

describe('Integration/functional tests:', function () {
    var malformedBody;
    var properBody;

    it('Invalid route request.', (done) => {
        CHAI.request(APP)
            .post('/')
            .send({})
            .end((err, res) => {
                expect(res).to.be.status(404);
                done();
            });
    });

    it('Invalid request header.', (done) => {
        CHAI.request(APP)
            .post('/calculate')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({})
            .end((err, res) => {
                expect(res).to.be.status(400);
                expect(JSON.stringify(res.body.error)).to.equal('"Content-Type:application/x-www-form-urlencoded is not supported."');
                done();
            });
    });

    it('Empty body.', (done) => {
        CHAI.request(APP)
            .post('/calculate')
            .send({})
            .end((err, res) => {
                expect(res.body.error).to.be.equal('Empty request body.');
                expect(res).to.be.status(400);
                done();
            });
    });

    it('Returns JSON with the calculated coefficients.', (done) => {

        properBody = [
            {
                "independentDataSet":
                {
                    "rows": 6,
                    "columns": 3,
                    "valuesArray": [1142, 1060, 325, 863, 995, 98, 1065, 3205, 23, 554, 120, 0, 983, 2896, 120, 256, 485, 88],
                    "isDependent": false
                },

                "dependentDataSet": {
                    "rows": 6,
                    "columns": 1,
                    "valuesArray": [201, 98, 162, 54, 138, 61],
                    "isDependent": true
                }
            }
        ];


        var expectedResult = {
            result:
            [[0.5664574696019713],
            [0.06532925469423256],
            [0.008718736194584409],
            [0.15104864761034875]]
        };

        CHAI.request(APP)
            .post('/calculate')
            .send(properBody)
            .end((err, res) => {
                expect(err).to.null;
                expect(res).to.be.status(200);
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify(expectedResult));
                done();
            });

    });

    it('Invalid value in JSON "row" field.', (done) => {

        malformedBody = [
            {
                "independentDataSet":
                {
                    "rows": 0,
                    "columns": 3,
                    "valuesArray": [345, 65, 23, 168, 18, 18, 94, 0, 0, 187, 185, 98, 621, 87, 10, 255, 0, 0],
                    "isDependent": false
                },

                "dependentDataSet": {
                    "rows": 6,
                    "columns": 1,
                    "valuesArray": [31.4, 14.6, 6.4, 28.3, 42.1, 15.3],
                    "isDependent": true
                }
            }
        ];
        CHAI.request(APP)
            .post('/calculate')
            .send(malformedBody)
            .end((err, res) => {
                expect(res.body.error).to.be.equal('Invalid values for rows.');
                expect(res).to.be.status(400);
                done();
            })
    });

    it('Invalid value in JSON "column" field.', (done) => {

        malformedBody = [
            {
                "independentDataSet":
                {
                    "rows": 6,
                    "columns": 0,
                    "valuesArray": [345, 65, 23, 168, 18, 18, 94, 0, 0, 187, 185, 98, 621, 87, 10, 255, 0, 0],
                    "isDependent": false
                },

                "dependentDataSet": {
                    "rows": 6,
                    "columns": -1,
                    "valuesArray": [31.4, 14.6, 6.4, 28.3, 42.1, 15.3],
                    "isDependent": true
                }
            }
        ];
        CHAI.request(APP)
            .post('/calculate')
            .send(malformedBody)
            .end((err, res) => {
                expect(res.body.error).to.be.equal('Invalid values for columns.');
                expect(res).to.be.status(400);
                done();
            })
    });

    it('Invalid JSON fields for data sets.', (done) => {

        malformedBody = [
            {
                "independentDataSet":
                {
                    "rows": 6,
                    "columns": 3,
                    "valuesArray": [345, 65, 23, 168, 18, 18, 94, 0, 0, 187, 185, 98, 621, 87, 10, 255, 0, 0],
                    "dummy": 'test',
                    "isDependent": false
                },

                "dependentDataSet": {
                    "rows": 6,
                    "columns": 1,
                    "valuesArray": [31.4, 14.6, 6.4, 28.3, 42.1, 15.3],
                    "isDependent": true
                }
            }
        ];
        CHAI.request(APP)
            .post('/calculate')
            .send(malformedBody)
            .end((err, res) => {
                expect(res.body.error).to.be.equal('Invalid number of data set fields.');
                expect(res).to.be.status(400);
                done();
            })
    });

    it('Invalid number of elements in "valuesArray".', (done) => {
        malformedBody = [
            {
                "independentDataSet":
                {
                    "rows": 6,
                    "columns": 3,
                    "valuesArray": [345, 65, 23, 168, 18, 18, 94, 0, 0, 187, 185, 98, 621, 87, 10, 255, 0, 0],
                    "isDependent": false
                },

                "dependentDataSet": {
                    "rows": 6,
                    "columns": 1,
                    "valuesArray": [31.4, 14.6, 6.4, 28.3, 42.1, 15.3, 1],
                    "isDependent": true
                }
            }
        ];
        CHAI.request(APP)
            .post('/calculate')
            .send(malformedBody)
            .end((err, res) => {
                expect(res.body.error).to.be.equal('Invalid number of values in array.');
                expect(res).to.be.status(400);
                done();
            })
    });

    it('Invalid values in "valuesArray" field.', (done) => {
        malformedBody = [
            {
                "independentDataSet":
                {
                    "rows": 6,
                    "columns": 3,
                    "valuesArray": [345, 65, 23, 168, 18, 18, 94, 0, 0, 187, 185, 98, 621, 87, 'a', 255, 0, 0],
                    "isDependent": false
                },

                "dependentDataSet": {
                    "rows": 6,
                    "columns": 1,
                    "valuesArray": [31.4, 14.6, 6.4, 28.3, 42.1, 15.3],
                    "isDependent": true
                }
            }
        ];

        CHAI.request(APP)
            .post('/calculate')
            .send(malformedBody)
            .end((err, res) => {
                expect(res.body.error).to.be.equal('Invalid type of value in array.');
                expect(res).to.be.status(400);
                done();
            })
    });
});
