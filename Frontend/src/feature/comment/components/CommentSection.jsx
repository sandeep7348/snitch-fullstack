import React, { useEffect } from "react";
import { useComments } from "../hooks/useComments";
import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";
import styles from "../comments.module.scss";

const CommentSection = ({ postId }) => {
  const {
    comments = [],
    loading,
    message,
    loadComments,
  } = useComments();

  useEffect(() => {
    if (postId) {
      loadComments(postId);
    }
  }, [postId, loadComments]);

  return (
    <section className={styles.commentSection}>
      <h2 className={styles.heading}>
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </h2>

      {loading && (
        <p className={styles.message}>
          Loading comments...
        </p>
      )}

      {!loading &&
        message &&
        comments.length > 0 && (
          <p className={styles.message}>
            {message}
          </p>
        )}

      {/* Comments */}
      {!loading && comments.length > 0 && (
        <div className={styles.commentList}>
          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
            />
          ))}
        </div>
      )}

      {/* Add Comment Form at the bottom */}
      <CommentForm postId={postId} />
    </section>
  );
};

export default CommentSection;