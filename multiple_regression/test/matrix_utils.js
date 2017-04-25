/**
 * matrix_utils.js
 * Unit testing.
 * 
 * @version 0.1
 * @author  Georgi Kotov
 * @updated 2017-04-21
 *
 */
//Chai Documentation: http://chaijs.com/guide/
//MathJS Documentation: http://mathjs.org/docs/
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const matrixUtils = require('../models/matrix_utils');
const math = require('mathjs');
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should;

describe('Unit tests:', function () {
    var defaultRows = 6;
    var defaultColumns = 3;
    var defaultValuesArray = [345, 65, 23, 168, 18, 18, 94, 0, 0, 187, 185, 98, 621, 87, 10, 255, 0, 0];
    var defaultIsDependent = false;
    var dataSet = {
        rows: defaultRows,
        columns: defaultColumns,
        valuesArray: defaultValuesArray,
        isDependent: defaultIsDependent
    };
    var expectedResult;


    it('Should create independent matrix successfully.', function () {
        expectedResult = math.matrix(
            [[1, 345, 65, 23],
            [1, 168, 18, 18],
            [1, 94, 0, 0],
            [1, 187, 185, 98],
            [1, 621, 87, 10],
            [1, 255, 0, 0]]);

        dataSet.rows = defaultRows;
        dataSet.columns = defaultColumns;
        dataSet.valuesArray = defaultValuesArray;
        dataSet.isDependent = defaultIsDependent;
        return expect(matrixUtils.createMatrix(dataSet)).to.eventually.become(expectedResult);
    });

    it('Should create dependent matrix successfully.', function () {
        expectedResult = math.matrix(
            [[345, 65, 23],
            [168, 18, 18],
            [94, 0, 0],
            [187, 185, 98],
            [621, 87, 10],
            [255, 0, 0]]);

        dataSet.rows = defaultRows;
        dataSet.columns = defaultColumns;
        dataSet.valuesArray = defaultValuesArray;
        dataSet.isDependent = true;
        return expect(matrixUtils.createMatrix(dataSet)).to.eventually.become(expectedResult);
    });

    it('Should fail invalid rows.', function () {
        expectedResult = 'Invalid values for rows.';
        dataSet.rows = 0;
        dataSet.columns = 1;
        dataSet.valuesArray = defaultValuesArray;
        dataSet.isDependent = defaultIsDependent;
        return expect(matrixUtils.createMatrix(dataSet)).to.eventually.rejectedWith(expectedResult);
    });

    it('Should fail invalid columns.', function () {
        expectedResult = 'Invalid values for columns.';
        
        dataSet.rows = 1;
        dataSet.columns = 0;
        dataSet.valuesArray = defaultValuesArray;
        dataSet.isDependent = defaultIsDependent;
        return expect(matrixUtils.createMatrix(dataSet)).to.eventually.rejectedWith(expectedResult);
    });

    it('Should fail smaller array size.', function () {
        expectedResult = 'Invalid number of values in array.';

        dataSet.rows = defaultRows;
        dataSet.columns = defaultColumns;
        dataSet.valuesArray = defaultValuesArray;
        dataSet.isDependent = defaultIsDependent;
        dataSet.valuesArray.length = 6 * 3 - 1;

        return expect(matrixUtils.createMatrix(dataSet)).to.eventually.rejectedWith(expectedResult);
    });

    it('Should fail larger array size.', function () {
        expectedResult = 'Invalid number of values in array.';

        dataSet.rows = defaultRows;
        dataSet.columns = defaultColumns;
        dataSet.valuesArray = defaultValuesArray;
        dataSet.isDependent = defaultIsDependent;
        dataSet.valuesArray.length = 6 * 3 + 1;

        return expect(matrixUtils.createMatrix(dataSet)).to.eventually.rejectedWith(expectedResult);
    });


    it('Should fail invalid array element.', function () {
        expectedResult = 'Invalid type of value in array.';
        dataSet.rows = defaultRows;
        dataSet.columns = defaultColumns;        
        dataSet.valuesArray = [345, 65, 23, 168, 18, 18, 94, 0, 0, 187, 185, 98, 621, 87, 10, 255, 'a', 0];
        dataSet.isDependent = defaultIsDependent;

        return expect(matrixUtils.createMatrix(dataSet)).to.eventually.rejectedWith(expectedResult);
    });

    it('Should make successful comparison.', function () {
        expectedResult = math.matrix([
            [0.5664574696019713],
            [0.06532925469423256],
            [0.008718736194584409],
            [0.15104864761034875]]);

        //reuse existing dataSet
        independentMatrix = math.matrix(
            [[1, 345, 65, 23],
            [1, 168, 18, 18],
            [1, 94, 0, 0],
            [1, 187, 185, 98],
            [1, 621, 87, 10],
            [1, 255, 0, 0]]);

        //create dependent data set
        dependentMatrix = math.matrix(
            [[31.4],
            [14.6],
            [6.4],
            [28.3],
            [42.1],
            [15.3]]);
        return expect(Promise.resolve(matrixUtils.calculateCoefficients(independentMatrix, dependentMatrix))).to.eventually.become(expectedResult);
    });

    it('Should fail when have incorrect "isDependent" value.', function () {
        expectedResult = 'Incorrect "isDependent" value.';

        dataSet.rows = defaultRows;
        dataSet.columns = defaultColumns;
        dataSet.valuesArray = defaultValuesArray;
        dataSet.isDependent = 'random';
        dataSet.valuesArray.length = 6 * 3;

        return expect(matrixUtils.createMatrix(dataSet)).to.eventually.rejectedWith(expectedResult);
    });
});
