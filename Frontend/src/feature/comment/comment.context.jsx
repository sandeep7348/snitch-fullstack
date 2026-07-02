import { createContext, useCallback, useState } from "react";
import {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  replyToComment,
  getReplies,
} from "./service/comment.api";

export const CommentsContext = createContext();

function CommentsProvider({ children }) {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadComments = useCallback(async (postId) => {
    setLoading(true);
    setMessage("");

    try {
      const data = await getCommentsByPost(postId);

      console.log("Comments API:", data);

      setComments(data.comments || []);
    } catch (error) {
      console.error(error);

      setComments([]);

      setMessage(
        error.response?.data?.message || "Unable to fetch comments."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddComment = useCallback(
    async (postId, content) => {
      setLoading(true);

      try {
        await addComment(postId, content);

        await loadComments(postId);

        setMessage("Comment added successfully.");
      } catch (error) {
        console.error(error);

        setMessage(
          error.response?.data?.message ||
            "Unable to add comment."
        );
      } finally {
        setLoading(false);
      }
    },
    [loadComments]
  );

  const handleUpdateComment = useCallback(
    async (commentId, content, postId) => {
      setLoading(true);

      try {
        await updateComment(commentId, content);

        await loadComments(postId);

        setMessage("Comment updated successfully.");
      } catch (error) {
        console.error(error);

        setMessage(
          error.response?.data?.message ||
            "Unable to update comment."
        );
      } finally {
        setLoading(false);
      }
    },
    [loadComments]
  );

  const handleDeleteComment = useCallback(
    async (commentId, postId) => {
      setLoading(true);

      try {
        await deleteComment(commentId);

        await loadComments(postId);

        setMessage("Comment deleted successfully.");
      } catch (error) {
        console.error(error);

        setMessage(
          error.response?.data?.message ||
            "Unable to delete comment."
        );
      } finally {
        setLoading(false);
      }
    },
    [loadComments]
  );

  const handleReply = useCallback(async (commentId, content) => {
    setLoading(true);

    try {
      await replyToComment(commentId, content);

      const data = await getReplies(commentId);

      console.log("Replies after adding:", data);

      setReplies(data.replies || []);

      setMessage("Reply added successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to reply."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReplies = useCallback(async (commentId) => {
    setLoading(true);

    try {
      const data = await getReplies(commentId);

      console.log("Replies API Response:", data);

      setReplies(data.replies || []);
    } catch (error) {
      console.error(error);

      setReplies([]);

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch replies."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CommentsContext.Provider
      value={{
        comments,
        replies,
        loading,
        message,
        loadComments,
        loadReplies,
        handleAddComment,
        handleUpdateComment,
        handleDeleteComment,
        handleReply,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}

export default CommentsProvider;