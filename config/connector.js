var connection = require('./connection')
var mongoose = require('mongoose')
var mysql = require("mysql")

function Connector() {
    /*
        This is database connector module to connect to MySQL Database
    */
    this.connector = mysql.createConnection(connection.MySqlDbConnection)
    this.connector.connect(function(error) {
        if (err) {
            console.error("Error when connecting to MySQL Database: " + err.stack);
            return;
        }
        require('../database/init')
    })

}

module.exports = new Connector()