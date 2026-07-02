import React, { useState } from "react";
import { useComments } from "../hooks/useComments";
import ReplySection from "./ReplySection";
import styles from "../comments.module.scss";

const CommentCard = ({ comment }) => {
  const {
    handleUpdateComment,
    handleDeleteComment,
    loading,
  } = useComments();

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment?.content || "");

  const postId =
    comment?.postId ||
    comment?.post?._id ||
    comment?.post;

  const userName =
    comment?.userId?.fullName ||
    comment?.user?.fullName ||
    comment?.userId?.email ||
    comment?.user?.email ||
    "Unknown User";

  const updateComment = async () => {
    if (!content.trim()) return;

    try {
      await handleUpdateComment(
        comment._id,
        content,
        postId
      );
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async () => {
    if (!window.confirm("Delete this comment?")) {
      return;
    }

    try {
      await handleDeleteComment(
        comment._id,
        postId
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.commentCard}>
      <div className={styles.commentHeader}>
        <h4>{userName}</h4>

        <small>
          {comment?.createdAt
            ? new Date(comment.createdAt).toLocaleString()
            : ""}
        </small>
      </div>

      {editing ? (
        <>
          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
          />

          <div className={styles.actions}>
            <button
              onClick={updateComment}
              disabled={loading}
            >
              Save
            </button>

            <button
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p>{comment?.content || ""}</p>

          <div className={styles.actions}>
            <button
              onClick={() => setEditing(true)}
              disabled={loading}
            >
              Edit
            </button>

            <button
              onClick={deleteComment}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </>
      )}

      {comment?._id && (
        <ReplySection commentId={comment._id} />
      )}
    </div>
  );
};

export default CommentCard;