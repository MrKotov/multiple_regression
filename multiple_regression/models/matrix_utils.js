/**
 * math_utils.js
 * Validates that matrix and its content.
 * Applies multiple regression and calculates coefficients.
 * 
 * @version 0.1
 * @author  Georgi Kotov
 * @updated 2017-04-21
 *
 */

const MATH = require('mathjs');
exports.createMatrix = function createMatrix(args) {
    var rows = args.rows;
    var columns = args.columns;
    var valuesArray = args.valuesArray;
    var isDependent = args.isDependent;
    //validate input matrix data
    return new Promise(
        (resolve, reject) => {
            
            var fieldCounter = 0;

            for(var option in args) {
                ++fieldCounter;
            }

            if(fieldCounter != 4) {
                return reject('Invalid number of data set fields.');
            }

            if (rows < 1 && columns > 0) {
                return reject('Invalid values for rows.');
            }

             if (rows > 0 && columns < 1) {
                return reject('Invalid values for columns.');
            }
            
            if (valuesArray.length != rows * columns) {
                return reject('Invalid number of values in array.');
            }

            valuesArray.forEach(function (element) {
                if (isNaN(element)) {
                    return reject('Invalid type of value in array.');
                }
            }, this);

            var chunkedArray = [];
            var chunk = columns;
            // if(isDependent != false || isDependent != true) {
            //     return reject('Incorrect isDependent value.');
            // }

            if (isDependent) {
                for (i = 0; i < valuesArray.length; i += chunk) {
                    tempArray = valuesArray.slice(i, i + chunk);
                    chunkedArray.push(tempArray);
                }
            } else {
                for (i = 0; i < valuesArray.length; i += chunk) {
                    tempArray = valuesArray.slice(i, i + chunk);
                    tempArray.unshift(1);
                    chunkedArray.push(tempArray);
                }
            }
            
            return resolve(MATH.matrix(chunkedArray));
        });
};
//apply multiple regression logic and calculate coefficients
//MathJS Documentation: http://mathjs.org/docs/
exports.calculateCoefficients = function calculateCoefficients (indepndentMatrix, dependentMatrix) {
    var transposedIndepndentMatrix = MATH.transpose(indepndentMatrix);
    return MATH.multiply(
        MATH.inv(MATH.multiply(transposedIndepndentMatrix, indepndentMatrix)),
        MATH.multiply(transposedIndepndentMatrix, dependentMatrix));
};