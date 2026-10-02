import express from "express";
import multer from "multer";
import { isAuthenticated } from "../controllers/auth.controller.js";
import { CreatePost, getAllPost ,getPostById,updatePost,deletePost,getPostByCategory,getDistinctCategory,searchProduct
} from "../controllers/post.controller.js";
import { createPostValidation, searchValidation, paginationValidation } from "../validators/post.validator.js";
import { validateRequest } from "../middleware/validate.middleware.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.post(
  "/post",
  isAuthenticated,
  upload.single("image"),
  createPostValidation,
  validateRequest,
  CreatePost
);
router.get("/allpost", paginationValidation, validateRequest, getAllPost);
router.get('/post/:id', getPostById);
router.put("/post/:postId", isAuthenticated, updatePost);
router.delete(
  "/post/:postId",
  isAuthenticated,
  deletePost
);
router.get("/category/:category", paginationValidation, validateRequest, getPostByCategory);
router.get("/categories", getDistinctCategory);
router.post("/search", searchValidation, validateRequest, searchProduct);
export default router;