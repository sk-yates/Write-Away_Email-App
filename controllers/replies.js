const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Reply = require('../models/reply.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const reply = await Reply.create(req.body);
    reply._doc.author = req.user;
    res.status(201).json(reply);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Student view of Reply - Index
router.get('/', async (req, res) => {
  try {
    const replies = await Reply.find({author: req.user._id})
      .populate('author')
      .sort({ createdAt: 'desc' });
    res.status(200).json(replies);
  } catch (error) {
    res.status(500).json(replies);
  }
});

// Student view of Reply - Show
router.get('/:replyId', async (req, res) => {
  try {
    const { replyId } = req.params;
    const reply = await Reply.findById(replyId).populate('author');
    if (!reply) {
      return res.status(404).json({ error: 'Student Reply not found' });
    }
    res.status(200).json(reply);
  } catch (error) {
    console.error(reply);
    res.status(500).json({ error: 'Server error while retrieving the Student Reply' });
  }
});

// Student view of Reply - Update
router.put('/:replyId', async (req, res) => {
  try {
    const { replyId } = req.params;
    const updatedReply = await Reply.findByIdAndUpdate(
      replyId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('author');

    if (!updatedReply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    res.status(200).json(updatedReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating this Student Reply' });
  }
});

// Student view of Reply - Update
router.delete('/drafts/:replyId', async (req, res) => {
  try {
    const { replyId } = req.params;
    const deletedReply = await Reply.findByIdAndDelete(replyId);

    if (!deletedReply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    res.status(200).json({ message: 'Student Reply deleted successfully', deletedReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting the Reply' });
  }
});

module.exports = router;