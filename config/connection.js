module.exports = {

    //Default is MongoDbConnection - MongoDB Server

    "Default": "MongoDbConnection",

    "MongoDbConnection": {
        "host": "mongodb://localhost",
        "port": 27017,
        "username": "",
        "password": "",
        "database": "rpi-monsys"
    }

    //If you want to use MySQL Server, comment out of here

    /*
    "MySqlDbConnection": {
        "host": "localhost",
        "port": "3306",
        "username": "root",
        "password": "",
        "database": "rpi-monsys"
    }
    */
}