import api from "./Api";

export const getPagesApi = params =>
  api.get(`page/index`, { params }).then(res => res.data);

export const addPageApi = body =>
  api.post(`page/store`, body).then(res => res.data);

export const editPageApi = ({ id, body }) =>
  api.put(`/page/update/${id}`, body).then(res => res.data);

export const getSinglePageApi = id =>
  api.get(`/page/show/${id}`).then(res => res.data);

export const removePagesApi = id =>
  api.delete(`page/destroy/${id}`).then(res => res.data);


export const quickPageEditApi = ({ id, body }) =>
  api
    .post(`/reports/store-room/update-property/${id}`, body)
    .then(res => res.data);
