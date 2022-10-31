import api from "./Api";

export const initialCategoryPageApi = params =>
  api.get(`/categories/fathers-index`, { params }).then(res => res.data);

export const getCategoryItemsApi = ({ id, ...params }) =>
  api.get(`/categories/child/${id}/items`, { params }).then(res => res.data);

export const renameChildrenApi = body =>
  api.put(`/categories/rename-children`, body).then(res => res.data);

export const removeChildrenApi = id =>
  api.delete(`/categories/destroy-item/${id}`).then(res => res.data);

export const addCategoryApi = body =>
  api.post(`/categories/store-item`, body).then(res => res.data);

export const editCategoryApi = ({ id, body }) =>
  api.put(`/categories/update-item/${id}`, body).then(res => res.data);

export const getMapProductsApi = id =>
  api.get(`/categories/item/${id}/products`).then(res => res.data);

export const setImageForMapApi = ({ id, body }) =>
  api.post(`/categories/item/${id}/store-image`, body).then(res => res.data);

export const addProductToMapApi = ({ id, body }) =>
  api.post(`/categories/item/${id}/store-product`, body).then(res => res.data);


export const updateOrderApi = ( order, category_id ) =>
  api.get(`/categories/update-order-item/${category_id}-${order}`).then(res => res.data);

  
  export const updateMenuApi = () =>
  api.post(`/categories/updateMenu`).then(res => res.data);


export const removeProductFromMapApi =(product_id,id) =>
  api
    .post(
      `/categories/item/${id}/destroy-product`,
      {},
      {
        params: {
          product_id,
        },
      },
    )
    .then(res => res.data);

export const reorderCategoriesApi = body =>
  api.put(`/categories/reorder-items`, body).then(res => res.data);
