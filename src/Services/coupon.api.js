import api from "./Api";

export const getCouponsApi = params =>
  api.get(`/coupons/index`, { params }).then(res => res.data);

export const getSingleCouponApi = id =>
  api.get(`/coupons/show/${id}`).then(res => res.data);

export const addCouponApi = body =>
  api.post(`/coupons/store`, body).then(res => res.data);

export const editCouponApi = ({ id, body }) =>
  api.put(`/coupons/update/${id}`, body).then(res => res.data);

export const removeCouponApi = id =>
  api.delete(`/coupons/destroy/${id}`).then(res => res.data);
