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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reply = await Reply.findById(id).populate('author');
    if (!reply) {
      return res.status(404).json({ error: 'Student Reply not found' });
    }
    res.status(200).json(reply);
  } catch (error) {
    console.error(reply);
    res.status(500).json({ error: 'Server error while retrieving the Student Reply' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReply = await Reply.findByIdAndUpdate(
      id,
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

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmail = await Email.findByIdAndDelete(id);

    if (!deletedEmail) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.status(200).json({ message: 'Email deleted successfully', deletedEmail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting the email' });
  }
});

module.exports = router;