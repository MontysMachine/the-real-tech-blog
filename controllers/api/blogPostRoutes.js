const router = require('express').Router();
const { BlogPost } = require('../../models');

// create post
router.post('/', async (req, res) => {
  try {
    const newPost = await BlogPost.create({
      ...req.body,
      userId: req.session.userId
    });
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update post
router.put('/:id', async (req, res) => {
  try {
    const post = await BlogPost.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (!post) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!post) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
