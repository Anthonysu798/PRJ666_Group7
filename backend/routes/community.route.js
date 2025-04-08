import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getPosts,
  createPost,
  likePost,
  commentOnPost,
  deletePost 
} from '../controllers/community.controller.js';
import multer from 'multer';

const router = express.Router();

// Use memory storage for Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Custom middleware to prevent multiple posts
let isPosting = false;
const preventMultiplePosts = async (req, res, next) => {
  if (isPosting) {
    return res.status(429).json({ 
      success: false,
      message: 'Please wait for your previous post to complete'
    });
  }
  isPosting = true;
  next();
};

// Custom file validation middleware
const validateImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Only JPG, PNG, GIF and WEBP images are allowed'
    });
  }

  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: 'Image size should be less than 5MB'
    });
  }

  next();
};

// Reset isPosting after request completes
const resetPostingStatus = (req, res, next) => {
  res.on('finish', () => {
    isPosting = false;
  });
  next();
};

// Routes
router.get('/posts', protect, getPosts);
router.post('/posts', 
  protect, 
  preventMultiplePosts,
  resetPostingStatus,
  upload.single('image'),
  validateImage,
  createPost
);
router.post('/posts/:postId/like', protect, likePost);
router.post('/posts/:postId/comment', protect, commentOnPost);
router.delete('/posts/:postId', protect, deletePost);

export default router; 