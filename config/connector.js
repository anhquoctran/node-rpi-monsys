var connection = require('./connection')
var mongoose = require('mongoose')
var mysql = require("mysql")

function Connector() {
    /*
        This is database connector module to connect to MySQL Database
    */
    this.connector = mysql.createConnection(connection.MySqlDbConnection)
    console.log("Connecting to database... ")
    this.connector.connect(function(error) {
        if (error) {
            console.error("Error when connecting to MySQL Database: " + error.stack);
            return;
        }
        console.log("Database connection has been established successfully!")
        require('../database/init')
    })

}

module.exports = new Connector()