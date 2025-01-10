const mongoose = require('mongoose');

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
        
        state: {
            enum: ["inbox", "drafts", "sent"]
        },

        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    },
    { timestamps: true },
);



const Email = mongoose.model('Email', emailSchema);

module.exports = Email;