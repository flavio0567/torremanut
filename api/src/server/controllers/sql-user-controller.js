const Connection = require('tedious').Connection;  

const User       = require('../models/user-model');
const config     = require('../config/config-sql');


exports.executeStatement = (req, res) => {
    
    // var connection = new Connection(config);
    
    var torremanut = new Sequelize(options.database, userName, password, {
        dialect: 'mssql',
        host: hostName,
        port: 1433, // Default port
        logging: false, // disable logging; default: console.log
    
        dialectOptions: {
            requestTimeout: 30000 // timeout = 30 seconds
        }
    });

}