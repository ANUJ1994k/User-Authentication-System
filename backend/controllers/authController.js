const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
  
    const { name, email, password, age, gender } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: 'User already exists' });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      user = new User({
        name,
        email,
        password: hashedPassword,
        age,
        gender,
      });
  
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: 'No user found with that email' });
  }

  // Generate a reset token (expires in 1 hour)
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpire = Date.now() + 3600000; // 1 hour

  // Save the reset token and expiration time in the user's document
  user.resetToken = resetToken;
  user.resetTokenExpire = resetTokenExpire;
  await user.save();

  const resetUrl = `https://user-authentication-system-rzdj.onrender.com/reset-password/${resetToken}`;

  // Send email with reset URL
  const message = `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}`;
  await sendEmail(user.email, 'Password Reset', message);

  return res.status(200).json({ msg: 'Password reset email sent successfully' });
};


exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    if (!token || !newPassword) {
      return res.status(400).json({ msg: 'Token and new password are required' });
    }
  
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },  // Check if the token is not expired
    });
  
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }
  
    // Update user's password
    user.password = newPassword;
    user.resetToken = undefined; // Clear the reset token
    user.resetTokenExpire = undefined; // Clear expiration time
    await user.save();
  
    return res.status(200).json({ msg: 'Password has been successfully reset' });
  };
  