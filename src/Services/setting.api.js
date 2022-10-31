import api from "./Api";

export const getTaxSettingApi = () =>
  api.get(`/general-setting/tax-and-rounding/index`).then(res => res.data);

export const getFormSettingApi = () =>
  api.get(`/general-setting/signup-forms/index`).then(res => res.data);

export const getInfoSettingApi = () =>
  api.get(`/general-setting/company-info/index`).then(res => res.data);

export const postTaxSettingApi = body =>
  api
    .post(`/general-setting/tax-and-rounding/setup`, body)
    .then(res => res.data);

export const postFormSettingApi = body =>
  api.post(`/general-setting/signup-forms/setup`, body).then(res => res.data);

export const postInfoSettingApi = body =>
  api.post(`/general-setting/company-info/setup`, body).then(res => res.data);

export const getCurrenciesApi = params =>
  api.get(`/currencies`, { params }).then(res => res.data);

  export const getCurrenciesWithIdApi = ( id ) =>
  api.get(`/currencies/show/${id}`).then(res => res.data);


export const addCurrencyApi = body =>
  api.post(`/currencies/store`, body).then(res => res.data);

export const editCurrencyApi = ({ id, body }) =>
  api.put(`/currencies/update/${id}`, body).then(res => res.data);

export const removeCurrencyApi = id =>
  api.delete(`/currencies/destroy/${id}`).then(res => res.data);
