var role = require('./role');

module.exports = {
    id: String,
    username: String,
    email: String,
    password: String,
    fullname: String,
    birthdate: Date,
    hometown: String,
    wherenow: String,
    bio: String,
    description: String,
    role: role.id
}