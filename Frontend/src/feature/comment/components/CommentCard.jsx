import React, { useState } from "react";
import { Star, CheckCircle2, Trash2, Edit2 } from "lucide-react";
import { useComments } from "../hooks/useComments";
import ReplySection from "./ReplySection";
import styles from "../comments.module.scss";

const CommentCard = ({ comment }) => {
  const { handleUpdateComment, handleDeleteComment, loading } = useComments();

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment?.content || "");

  const postId = comment?.postId || comment?.post?._id || comment?.post;
  const userName =
    comment?.userId?.fullName ||
    comment?.user?.fullName ||
    comment?.userId?.email ||
    comment?.user?.email ||
    "Verified Buyer";

  const updateComment = async () => {
    if (!content.trim()) return;
    try {
      await handleUpdateComment(comment._id, content, postId);
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async () => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await handleDeleteComment(comment._id, postId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.commentCard}>
      <div className={styles.commentHeader}>
        <div className={styles.authorRow}>
          <div className={styles.avatarCircle}>
            {userName[0].toUpperCase()}
          </div>
          <div>
            <div className={styles.nameBadgeRow}>
              <h4>{userName}</h4>
              <span className={styles.verifiedBadge}>
                <CheckCircle2 size={12} /> Verified Buyer
              </span>
            </div>
            <div className={styles.starRow}>
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} size={14} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
          </div>
        </div>

        <small className={styles.dateText}>
          {comment?.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Recently"}
        </small>
      </div>

      {editing ? (
        <div className={styles.editArea}>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          <div className={styles.actions}>
            <button onClick={updateComment} disabled={loading}>Save</button>
            <button onClick={() => setEditing(false)} className={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p className={styles.commentBody}>{comment?.content || ""}</p>
          <div className={styles.actions}>
            <button onClick={() => setEditing(true)} disabled={loading} className={styles.actionBtn}>
              <Edit2 size={13} /> Edit
            </button>
            <button onClick={deleteComment} disabled={loading} className={styles.deleteBtn}>
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}

      {comment?._id && <ReplySection commentId={comment._id} />}
    </div>
  );
};

export default CommentCard;