const mongoose = require('mongoose');

const MODELNAME = 'Mood';

const Schema = new mongoose.Schema(
    {
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        humor: {
            type: String,
            required: true,
            enum: ['happy', 'sad', 'angry', 'anxious']
        },
        comment: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);


const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;