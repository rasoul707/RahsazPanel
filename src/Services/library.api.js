import api from "./Api";

export const getLibraryDataApi = params =>
  api.get(`/library/images/index`, { params }).then(res => res.data);

export const deleteFileApi = id =>
  api.delete(`/library/images/destroy/${id}`).then(res => res.data);

export const uploadFileInLibraryApi = body =>
  api
    .post(`/library/images/store`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(res => res.data);

export const uploadVideoInLibraryApi = body =>
  api
    .post(`/library/videos/store`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(res => res.data);

export const EditFileInLibraryApi = ({ id, body }) =>
  api.put(`/library/images/update/${id}`, body).then(res => res.data);
