import React, { useState } from "react";
import { useComments } from "../hooks/useComments";
import styles from "../comments.module.scss";

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState("");

  const {
    handleAddComment,
    loading,
  } = useComments();

  const submitComment = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    await handleAddComment(postId, content);

    setContent("");
  };

  return (
    <form
      className={styles.commentForm}
      onSubmit={submitComment}
    >
      <textarea
        className={styles.commentInput}
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />

      <button
        type="submit"
        className={styles.commentButton}
        disabled={loading}
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};

export default CommentForm;