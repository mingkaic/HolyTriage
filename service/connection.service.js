"using strict";

const fs          = require('fs');
const path        = require('path');
const Sequelize   = require('sequelize');

const env         = process.env.NODE_ENV || "development";
const config      = require(path.join(__dirname, '..', 'config', 'dbconfig.json'))[env];

if (process.env.DATABASE_URL) {
    var connection = new Sequelize(process.env.DATABASE_URL);
}
else {
    if (typeof config.logging === 'undefined') {
        config.logging = function(msg) {
            fs.appendFileSync('sequelize.log', msg+'\n');
        };
    }
    var connection = new Sequelize(config.database, config.username, config.password, config);
}

connection.authenticate()
    .then(function(err) {
        console.log('Connection has been established.');
    })
    .catch(function (err) {
        console.error('Unable to connect to the database: ', err);
    });

module.exports = connection;
