import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { createContent, updateContent, deleteContent, getContent, getCategoriesByType, searchContent} from '../controller/contentController.js';

const router = express.Router();

// Routes for admin content operations, protected by auth middleware
router.route('/')
  .post(protect, admin, createContent) // Create content
  .put(protect, admin, updateContent)
   // Update content

router.route('/:id')
  .delete(protect, admin, deleteContent); // Delete content
router.get('/getContent', protect, getContent);
router.get('/categories', protect, getCategoriesByType);
router.get('/search', protect, searchContent); //search according to title or cast




export default router;
