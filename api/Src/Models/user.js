const mongoose = require('mongoose');

const MODELNAME = 'User';

const Schema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        avatar: {
            type: String,
            default: "normal",
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