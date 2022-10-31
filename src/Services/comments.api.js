import api from "./Api";

export const getCommentsApi = params =>
  api.get(`/comments/index`, { params }).then(res => res.data);

export const removeCommentApi = id =>
  api.delete(`/comments/destroy/${id}`).then(res => res.data);

export const toggleCommentStatusApi = id =>
  api.put(`/comments/active-toggle/${id}`).then(res => res.data);

export const answerToCommentApi = ({ id, body }) =>
  api.post(`/comments/response/${id}`, body).then(res => res.data);
