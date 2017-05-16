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
        host: '192.168.88.11',
        user: 'root',
        password: 'anhquoc1996@@',
        database: "rpi-monsys",
        multipleStatements: true,
        charset: 'utf8_general_ci',
        dateStrings: "date"
    }

}