import api from "./Api";

export const getCustomersApi = params =>
  api.get("/customers/index", { params }).then(res => res.data);

export const getSingleCustomerApi = id =>
  api.get(`/customers/show/${id}`).then(res => res.data);

export const getCustomerSearch = params=>
api.get(`/customers/label-search`, { params }).then(res => res.data);

export const addCustomerApi = body =>
  api.post("/customers/store", body).then(res => res.data);

export const updateCustomerApi = ({ id, body }) =>
  api.put(`/customers/update/${id}`, body).then(res => res.data);

export const deleteCustomerApi = id =>
  api.delete(`/customers/destroy/${id}`).then(res => res.data);
