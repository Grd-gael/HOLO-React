const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        last_login_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

Schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});


const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;