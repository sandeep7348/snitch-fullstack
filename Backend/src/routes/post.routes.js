import express from "express";
import multer from "multer";
import { isAuthenticated } from "../controllers/auth.controller.js";
import { CreatePost, getAllPost ,getPostById,updatePost,deletePost,getPostByCategory,getDistinctCategory,searchProduct
} from "../controllers/post.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.post(
  "/post",
  isAuthenticated,
  upload.single("image"),
  CreatePost
);
router.get("/allpost",getAllPost)
router.get('/post/:id',isAuthenticated,getPostById)
router.put("/post/:postId",isAuthenticated , updatePost);
router.delete(
  "/post/:postId",
  isAuthenticated,
  deletePost
);
router.get("/category/:category", getPostByCategory);
router.get("/categories", getDistinctCategory);
router.post("/search", searchProduct);
export default router;