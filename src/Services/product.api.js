import api from "./Api";

export const getProductsApi = params =>
  api.get(`/products/index`, { params }).then(res => res.data);

export const addProductApi = body =>
  api.post(`/products/store`, body).then(res => res.data);

export const editProductApi = ({ id, body }) =>
  api.put(`/products/update/${id}`, body).then(res => res.data);

export const getSingleProductApi = id =>
  api.get(`/products/show/${id}`).then(res => res.data);

export const removeProductApi = id =>
  api.delete(`/products/destroy/${id}`).then(res => res.data);

export const getProductCategoriesApi = id =>
  api.get(`/products/categories`, { params: { id } }).then(res => res.data);

export const quickProductEditApi = ({ id, body }) =>
  api
    .post(`/reports/store-room/update-property/${id}`, body)
    .then(res => res.data);
