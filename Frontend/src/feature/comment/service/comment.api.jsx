import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function addComment(postId, content) {
  const response = await api.post(`/api/comment/${postId}`, {
    content,
  });

  return response.data;
}

export async function getCommentsByPost(postId) {
  const response = await api.get(`/api/comment/post/${postId}`);

  return response.data;
}

export async function updateComment(commentId, content) {
  const response = await api.put(`/api/comment/${commentId}`, {
    content,
  });

  return response.data;
}

export async function deleteComment(commentId) {
  const response = await api.delete(`/api/comment/${commentId}`);

  return response.data;
}

export async function replyToComment(commentId, content) {
  const response = await api.post(`/api/comment/reply/${commentId}`, {
    content,
  });

  return response.data;
}

export async function getReplies(commentId) {
  const response = await api.get(`/api/comment/reply/${commentId}`);

  return response.data;
}