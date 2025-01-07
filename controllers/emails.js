const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Email = require('../models/email.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.post('/', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const email = await Email.create(req.body);
    email._doc.author = req.user;
    res.status(201).json(email);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const emails = await Email.find({})
      .populate('author')
      .sort({ createdAt: 'desc' });
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json(emails);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const email = await Email.findById(id).populate('author');
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    res.status(200).json(email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while retrieving the email' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('author');

    if (!updatedEmail) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.status(200).json(updatedEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating the email' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmail = await Email.findByIdAndDelete(id);

    if (!deletedEmail) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.status(200).json({ message: 'Email deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting the email' });
  }
});

router.post('/:emailId/replies', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const email = await Email.findById(req.params.emailId);
    email.replies.push(req.body);
    await email.save();
    
    const newReply = email.replies[email.replies.length - 1];

    
    newReply._doc.author = req.user;


    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json(error);
  }
});



module.exports = router;