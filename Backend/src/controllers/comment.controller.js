import Comment from "../models/comment.model.js";
import Post from "../models/post.models.js";



export async function commentOnPost(req, res) {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      content,
      userId,
      postId,
    });

    await comment.populate("userId", "fullName");
    await comment.populate("postId", "title");

    return res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}



export async function getCommentsByPost(req, res) {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      postId,
      parentComment: null,
    })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName");

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentComment: comment._id,
        })
          .sort({ createdAt: 1 })
          .populate("userId", "fullName");

        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    return res.status(200).json({
      message: "Comments fetched successfully",
      totalComments: comments.length,
      comments: commentsWithReplies,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


export async function getCommentById(req, res) {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id)
      .populate("userId", "fullName")
      .populate("postId", "title");

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      message: "Comment fetched successfully",
      comment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}



export async function updateComment(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You are unauthorized",
      });
    }

    comment.content = content;

    await comment.save();

    await comment.populate("userId", "fullName");
    await comment.populate("postId", "title");

    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}


export async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const post = await Post.findById(comment.postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isCommentOwner =
      comment.userId.toString() === userId;

    const isPostOwner =
      post.addedBy.toString() === userId;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({
        message: "You are unauthorized",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
export async function getCommentsByUser(req, res) {
  try {
    const userId = req.user.id;

    const comments = await Comment.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName")
      .populate("postId", "title");

    return res.status(200).json({
      message: "Comments fetched successfully",
      totalComments: comments.length,
      comments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
export async function getLatestComments(req, res) {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      postId,
      parentComment: null,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "fullName")
      .populate("postId", "title");

    return res.status(200).json({
      message: "Latest comments fetched successfully",
      totalComments: comments.length,
      comments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
export async function replyToComment(req, res) {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Reply cannot be empty",
      });
    }

    const parentComment = await Comment.findById(commentId);

    if (!parentComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const reply = await Comment.create({
      content,
      userId,
      postId: parentComment.postId,
      parentComment: commentId,
    });

    await reply.populate("userId", "fullName");
    await reply.populate("postId", "title");

    return res.status(201).json({
      message: "Reply added successfully",
      reply,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getReplies(req, res) {
  try {
    const { commentId } = req.params;

    const replies = await Comment.find({
      parentComment: commentId,
    })
      .sort({ createdAt: 1 })
      .populate("userId", "fullName")
      .populate("postId", "title");

    return res.status(200).json({
      message: "Replies fetched successfully",
      totalReplies: replies.length,
      replies,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}