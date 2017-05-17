module.exports = {


    /*"MongoDbConnection": {
        "host": "mongodb://localhost",
        "port": 27017,
        "username": "",
        "password": "",
        "database": "rpi-monsys"
    }*/

    //If you want to use MySQL Server, comment out of here

    "MySqlDbConnection": {
        host: '203.113.167.3',
        user: 'root',
        password: '@Hueic2016',
        database: "rpi-monsys",
        multipleStatements: true,
        charset: 'utf8_general_ci',
        dateStrings: "date"
    }

}