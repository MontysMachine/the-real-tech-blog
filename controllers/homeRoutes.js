const router = require('express').Router();
const { BlogPost, User } = require('../models');

router.get('/', async (req, res) => {
  try {
    const blogData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    });

    const blogs = blogData.map(blog => blog.get({ plain: true }));

    res.render('home', {
      blogs,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

router.get('/dashboard', async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      res.redirect('/login');
      return;
    }

    const userPosts = await BlogPost.findAll({
      where: {
        userId: req.session.userId
      },
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    });

    const posts = userPosts.map(post => post.get({ plain: true }));

    res.render('dashboard', {
      posts,
      loggedIn: req.session.loggedIn,
      username: req.session.username
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

