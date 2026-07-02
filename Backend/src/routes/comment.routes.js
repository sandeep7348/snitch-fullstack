import express from "express";
import {
    commentOnPost,
    deleteComment,
    getCommentById,
    getCommentsByPost,
    getCommentsByUser,
    getLatestComments,
    getReplies,
    replyToComment,
    updateComment

} from "../controllers/comment.controller.js";
import {isAuthenticated as IdentifyUser} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/:postId", IdentifyUser, commentOnPost);

router.get("/post/:postId", getCommentsByPost);

router.get("/latest/:postId", getLatestComments);

router.get("/me", IdentifyUser, getCommentsByUser);

router.get("/:id", getCommentById);

router.put("/:id", IdentifyUser, updateComment);

router.delete("/:commentId", IdentifyUser, deleteComment);

router.post("/reply/:commentId", IdentifyUser, replyToComment);

router.get("/reply/:commentId", getReplies);
export default router;