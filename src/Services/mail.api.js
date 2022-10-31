import api from "./Api";

export const getMailsApi = params =>
  api.get("/forms/index", { params }).then(res => res.data);

export const getSingleMailApi = id =>
  api.get(`/forms/show/${id}`).then(res => res.data);

export const removeMailApi = id =>
  api.delete(`/forms/destroy/${id}`).then(res => res.data);

export const sendInternalMessageApi = body =>
  api.post(`/internal-message/send`, body).then(res => res.data);

export const sendSingleSMSApi = body =>
  api.post(`/sms/send-single-sms`, body).then(res => res.data);

export const sendGroupSMSApi = body =>
  api.post(`/sms/send-group-sms`, body).then(res => res.data);

export const getSmsHistoryApi = params =>
  api.get("/sms/latest-group-sms", { params }).then(res => res.data);
