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



    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: mongoose.Schema.Types.ObjectId, ref: 'Email' },
    currentFolder: {
      type: String,
      enum: ["drafts", "sent"]
    },
  },
  { timestamps: true }
);


const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;