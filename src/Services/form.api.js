import api from "./Api";

export const getProductsForFormApi = params =>
  api.get(`/products/label-search`, { params }).then(res => res.data);

export const getCategoriesForFormApi = params =>
  api.get(`/products/label-search`, { params }).then(res => res.data);

export const getUsersForFormApi = params =>
  api.get(`/customers/label-search`, { params }).then(res => res.data);

export const getPackagesForFormApi = params =>
  api.get(`/customers/packages/label-search`, { params }).then(res => res.data);

export const getUsersTypeForFormApi = params =>
  api.get(`/products/label-search`, { params }).then(res => res.data);

export const getSubCategoryForFormApi = params =>
  api
    .get(`/products/sub-category/label-search`, { params })
    .then(res => res.data);

export const getCategoriesOfChildrenApi = ({ id, ...params }) =>
  api.get(`/categories/${id}/label-search`, { params }).then(res => res.data);
