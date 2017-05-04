var role = require('./role');

module.exports = {
    id: String,
    username: String,
    email: String,
    password: String,
    fullname: String,
    birthdate: Date,
    phone: String,
    hometown: String,
    wherenow: String,
    bio: String,
    description: String,
    role: {
        name: String,
        description: String
    }
}