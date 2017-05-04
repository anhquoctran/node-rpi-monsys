var user = require('../../app/models/user')
var session = require('../../app/models/session')
var connector = require('../../config/connector')

function SchemaBuilder() {
    this.createUserSchema = function() {
        return new connector.datasource.Schema(user)
    }

    this.createSessionSchema = function() {
        return new connector.datasource.Schema(session);
    }
}

module.exports = new SchemaBuilder()