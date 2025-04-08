import Post from '../models/post.model.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getPosts = async (req, res) => {
  try {
    const { category, sortBy = 'recent' } = req.query;
    
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'popular':
        sortOptions = { 'likes': -1, 'createdAt': -1 };
        break;
      case 'trending':
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: twentyFourHoursAgo };
        sortOptions = { 'likes': -1, 'comments': -1, 'createdAt': -1 };
        break;
      default:
        sortOptions = { 'createdAt': -1 };
    }

    const posts = await Post.find(query)
      .sort(sortOptions)
      .populate('author', 'name fullName profileImage googleImage avatar')
      .populate('likes', '_id')
      .populate({
        path: 'comments.user',
        select: 'name fullName profileImage googleImage avatar'
      })
      .lean();

    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      hasLiked: post.likes?.some(like => like._id.toString() === req.user._id.toString()) || false,
      likes: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0
    }));

    res.json({ 
      success: true, 
      posts: postsWithLikeStatus || []
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      posts: []
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, category } = req.body;
    let image = null;

    if (req.file) {
      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'community_posts' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Upload Error:', error);
              return reject(error);
            }
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      image = uploadResult.secure_url;
    }

    const post = new Post({
      author: req.user._id,
      content,
      category,
      image
    });

    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name fullName profileImage googleImage avatar')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Post created successfully! 🎉',
      post: {
        ...populatedPost,
        likes: 0,
        comments: 0,
        hasLiked: false
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userLikeIndex = post.likes.indexOf(req.user._id);
    
    if (userLikeIndex > -1) {
      post.likes.splice(userLikeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes.length,
      hasLiked: userLikeIndex === -1
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    // Add content validation
    if (!req.body.content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Add the new comment
    post.comments.push({
      user: req.user._id,
      content,
      createdAt: new Date()
    });

    await post.save();

    // Fetch the updated post with populated comments
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name fullName profileImage googleImage avatar')
      .populate('likes', '_id')
      .populate({
        path: 'comments.user',
        select: 'name fullName profileImage googleImage avatar'
      })
      .lean();

    res.json({
      success: true,
      message: 'Comment added successfully',
      post: {
        ...updatedPost,
        hasLiked: updatedPost.likes.some(like => like._id.toString() === req.user._id.toString()),
        likes: updatedPost.likes.length,
        commentsCount: updatedPost.comments.length
      }
    });
  } catch (error) {
    console.error('Error commenting on post:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}; 