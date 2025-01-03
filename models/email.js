const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
    {
        replyTo: {
            type: String,
            required: true,
        },

        replySubject: {
            type: String,
            required: true,
        },

        replyBody: {
            type: String,
            required: true,
        },

      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
  );

const emailSchema = new mongoose.Schema(

    {
        emailFrom: {
            type: String,
            required: true,
        },

        emailSubject: {
            type: String,
            required: true,
        },

        emailBody: {
            type: String,
            required: true,
        },

        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        replies: [replySchema]
    },
    { timestamps: true },
);



const Email = mongoose.model('Email', emailSchema);

module.exports = Email;