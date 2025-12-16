const mongoose = require('mongoose');

const MODELNAME = 'User';

const Schema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        name: {
            type: String,
            required: false,
            trim: true,
        },
        password: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        last_login_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);


const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;