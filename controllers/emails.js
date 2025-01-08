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

    // Determine recipients based on role
    let recipients;
    if (req.user.role === 'student') {
      // Students send emails to all teachers
      recipients = await User.find({ role: 'teacher' }).select('_id');
    } else if (req.user.role === 'teacher') {
      // Teachers send emails to their assigned students
      recipients = await User.find({ assignedTeacher: req.user._id }).select('_id');
    } else {
      // Admins cannot send emails
      return res.status(403).json({ error: 'Admins cannot send emails' });
    }

    // Create email with recipients
    const email = await Email.create({
      ...req.body,
      recipients: recipients.map(r => r._id), // Extract IDs from user objects
    });

    res.status(201).json(email);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating email' });
  }
});

router.get('/', async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'teacher') {
      // Teachers: View emails sent to them
      filter = { recipients: req.user._id };
    } else if (req.user.role === 'student') {
      // Students: View emails sent to them
      filter = { recipients: req.user._id };
    }

    const emails = await Email.find(filter)
      .populate('author recipients')
      .sort({ createdAt: 'desc' });

    res.status(200).json(emails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving emails' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the email and populate author and recipients
    const email = await Email.findById(id)
      .populate('author recipients');

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Restrict access: Only author or recipients can view
    const isAuthor = email.author._id.toString() === req.user._id.toString();
    const isRecipient = email.recipients.some(
      recipient => recipient._id.toString() === req.user._id.toString()
    );

    if (!isAuthor && !isRecipient) {
      return res.status(403).json({ error: 'Access denied' });
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

    res.status(200).json({ message: 'Email deleted successfully', deletedEmail });
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

router.put('/:emailId/replies/:replyId', async (req, res) => {
  try {
    // Fetch the email
    const email = await Email.findById(req.params.emailId);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Find the reply by ID
    const reply = email.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Update fields (only if provided in the request body)
    if (req.body.replyTo !== undefined) {
      reply.replyTo = req.body.replyTo;
    }
    if (req.body.replySubject !== undefined) {
      reply.replySubject = req.body.replySubject;
    }
    if (req.body.replyBody !== undefined) {
      reply.replyBody = req.body.replyBody;
    }

    // Save the email with the updated reply
    await email.save();

    // Respond with the updated reply
    res.status(200).json({ message: 'Reply updated', updatedReply: reply });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

router.delete('/:emailId/replies/:replyId', async (req, res) => {
  try {
    const email = await Email.findById(req.params.emailId);
    email.replies.remove({ _id: req.params.replyId });
    await email.save();
    res.status(200).json({ message: "Reply deleted", email })
  } catch (error) {
    res.status(500).json(error)
  }
});


module.exports = router;