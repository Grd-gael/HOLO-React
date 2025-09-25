const mongoose = require('mongoose');

const MODELNAME = 'User';

const Schema = new mongoose.Schema(
    {
        email : {
            type: String,
            required: true,
            trim : true,
            unique : true,
        },
        first_name : {
            type: String,
            required: true,
            trim : true,
        },
        last_name : {
            type: String,
            trim : true,
        },
        password: String,
        last_login_at : {
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