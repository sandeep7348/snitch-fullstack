import React, { useState } from "react";
import { Star, Send } from "lucide-react";
import { useComments } from "../hooks/useComments";
import styles from "../comments.module.scss";

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const { handleAddComment, loading } = useComments();

  const submitComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await handleAddComment(postId, `${"⭐".repeat(rating)} ${content}`);
    setContent("");
    setRating(5);
  };

  return (
    <form className={styles.commentForm} onSubmit={submitComment}>
      <div className={styles.ratingSelectorGroup}>
        <label>Your Rating:</label>
        <div className={styles.starPicker}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={styles.starBtn}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                size={20}
                fill={(hoverRating || rating) >= star ? "#f59e0b" : "none"}
                color={(hoverRating || rating) >= star ? "#f59e0b" : "var(--text-muted)"}
              />
            </button>
          ))}
          <span className={styles.ratingText}>
            {rating === 5 ? "Excellent (5/5)" : rating === 4 ? "Very Good (4/5)" : rating === 3 ? "Average (3/5)" : "Below Average"}
          </span>
        </div>
      </div>

      <textarea
        className={styles.commentInput}
        placeholder="Share your feedback on the fit, fabric quality, and sizing..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />

      <button type="submit" className={styles.commentButton} disabled={loading}>
        <Send size={16} /> {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default CommentForm;