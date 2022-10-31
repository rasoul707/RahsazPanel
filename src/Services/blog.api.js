import api from "./Api";

export const getBlogPostsApi = params =>
  api.get("/blog/index", { params }).then(res => res.data);

export const getSingleBlogPostApi = id =>
  api.get(`/blog/show/${id}`).then(res => res.data);

export const updateBlogPostStatusApi = (id, status) =>
  api.put(`/blog/update-status/${id}?status=${status}`).then(res => res.data);

export const deleteBlogPostApi = id =>
  api.delete(`/blog/destroy/${id}`).then(res => res.data);

export const addBlogPostApi = body =>
  api.post(`/blog/store`, body).then(res => res.data);

export const updateBlogPostApi = ({ id, body }) =>
  api.put(`/blog/update/${id}`, body).then(res => res.data);

export const getMyTeamForFormApi = params =>
  api.get(`/sub-admins/label-search`, { params }).then(res => res.data);
