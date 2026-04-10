const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { content, image, video } = req.body;
    
    // Validate that at least content or media is provided
    if (!content && !image && !video) {
      return res.status(400).json({ message: 'Post must contain text, image, or video' });
    }

    const newPost = new Post({
      content: content || '',
      image: image || '',
      video: video || '',
      author: req.user.id
    });

    const post = await newPost.save();
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'firstName lastName profilePicture headline');

    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts
// @desc    Get all posts (feed)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search ? { content: { $regex: search, $options: 'i' } } : {};
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'firstName lastName profilePicture headline')
      .populate('comments.user', 'firstName lastName profilePicture');

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/posts/:id/like
// @desc    Like/Unlike a post
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/:id/comment
// @desc    Comment on a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      text: req.body.text,
      user: req.user.id
    };

    post.comments.unshift(newComment);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'firstName lastName profilePicture headline')
      .populate('comments.user', 'firstName lastName profilePicture');

    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    post.content = req.body.content || post.content;
    post.image = req.body.image !== undefined ? req.body.image : post.image;
    post.video = req.body.video !== undefined ? req.body.video : post.video;

    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'firstName lastName profilePicture headline')
      .populate('comments.user', 'firstName lastName profilePicture');

    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
