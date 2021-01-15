const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/userModel');

router.post('/register', async (req, res) => {
  try {
    let { email, password, passwordCheck, username } = req.body;

    if (!email || !password || !passwordCheck)
      return res.status(400).json({msg: 'Missing required fields'});
    if (password.length < 5)
      return res.status(400).json({msg: 'Password must be at least 5 characters long'});
    if (password !== passwordCheck)
      return res.status(400).json({msg: 'Password and verify password need to match'});

    const existingUser = await User.findOne({email: email});
    if (existingUser)
      return res.status(400).json({msg: 'An account with this email already exists.'});

    if (!username) username = email;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: passwordHash,
      username
    });

    const savedUser = await newUser.save();
    res.json(savedUser);

  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
    return res.status(400).json({msg: 'Missing required fields'});

    const user = await User.findOne({email: email});
    if (!user)
      return res.status(400).json({msg: 'No user with this email exists.'});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({msg: 'The password is incorrect'});

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if(!token)
      return res.json(false);
    
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if(!verified)
      return res.json(false);
    
    const user = await User.findById(verified.id);
    if(!user)
      return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    return res.json({
      displayName: user.username,
      email: user.email,
      id: user._id
    });
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;