const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 3,
            maxlength: 30
        },
        email: {
            type: String,
            minlength: 3,
            maxlength: 200,
            unique: true,
        },
        password: {
            type: String,
            minlength: 3,
            maxlength: 200,
        },
        role: {
            type: String,
            default: 'customer',
            minlength: 4,
            maxlength: 10,
        },
        country: {
            type: String,
            default: ""
        },
        avatar: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: ""
        },
        phone: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
    }
);

const userModel = new mongoose.model('User', userSchema);

module.exports = userModel;