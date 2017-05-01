var connection = require('./connection')
var mongoose = require('mongoose')

function Connector() {
    /*
        This is database connector module to connect to MongoDB Database
    */

    this.connector = mongoose.connect(connection.MongoDbConnection.host + ":" + connection.MongoDbConnection.port + "/" + connection.MongoDbConnection.database)

    mongoose.connection.on('connected', function() {
        console.log("Connect to database has been established")
    })

    mongoose.connection.on('error', function(error) {
        console.log('Error occurred when connect to database: ' + error)
    })

    mongoose.connection.on('disconnected', function() {
        console.log('Database connection disconnected')
    });

}