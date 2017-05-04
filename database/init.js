var database = require("../config/connector")
var fs = require('fs')

function InitDatabase() {
    const sqlFile = "../database/data/init.sql"
    var data = fs.readFileSync(sqlFile, 'utf8')
    console.log("Initializing database...")
    database.connector.query(data, function(err, result) {
        if (err) throw err;
        else console.log("Database has been created successfully!")
    })
}

module.exports = InitDatabase