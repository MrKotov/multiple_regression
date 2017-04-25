/**
 * index.js
 * Start point of the program.
 * 
 * @version 0.1
 * @author  Georgi Kotov
 * @updated 2017-04-21
 *
 */
//Express Documentation: https://expressjs.com/en/api.html 
const EXPRESS = require('express');
const APP = EXPRESS();

process.on('uncaughtException', (err) => {
  console.log('uncaughtException:\n' + err);
});

APP.use(require('./controllers'));

APP.listen(3000, () => {
    console.log('Running http server on port 3000...');
});

module.exports = APP;