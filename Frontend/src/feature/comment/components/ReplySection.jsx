import React, { useEffect, useState } from "react";
import { useComments } from "../hooks/useComments";
import styles from "../comments.module.scss";

const ReplySection = ({ commentId }) => {
  const {
    replies,
    loadReplies,
    handleReply,
    loading,
  } = useComments();

  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (showReplies) {
      loadReplies(commentId);
    }
  }, [showReplies, commentId, loadReplies]);

  const submitReply = async () => {
    if (!reply.trim()) return;

    await handleReply(commentId, reply);

    setReply("");

    await loadReplies(commentId);
  };

  return (
    <div className={styles.replySection}>
      <button
        className={styles.replyButton}
        onClick={() => setShowReplies((prev) => !prev)}
      >
        {showReplies ? "Hide Replies" : "View Replies"}
      </button>

      {showReplies && (
        <>
          <div className={styles.replyForm}>
            <input
              type="text"
              placeholder="Write a reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />

            <button onClick={submitReply}>
              Reply
            </button>
          </div>

          {loading ? (
            <p>Loading replies...</p>
          ) : (
            <div className={styles.replyList}>
              {replies.length === 0 ? (
                <p>No replies yet.</p>
              ) : (
                replies.map((item) => (
                  <div
                    key={item._id}
                    className={styles.replyCard}
                  >
                    <h5>{item.userId.fullName}</h5>

                    <p>{item.content}</p>

                    <small>
                      {new Date(item.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReplySection;