const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');

// Sign up
router.post('/signup', async (req, res) => {
  try {
    console.log('Sign up request received');
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({ username: req.body.username, password: hashedPassword });
    req.session.save(() => {
      req.session.userId = newUser.id;
      req.session.loggedIn = true;
      res.status(200).json(newUser);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Log in
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      req.session.userId = user.id;
      req.session.loggedIn = true;
      res.status(200).json({ user, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Log out
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
