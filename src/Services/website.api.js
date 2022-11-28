import api from "./Api";

// sliders
export const getWebsiteSlidersApi = () =>
  api.get(`/website-setting/sliders/index`).then(res => res.data);

export const addSliderToWebsiteApi = body =>
  api.post(`/website-setting/sliders/store`, body).then(res => res.data);

export const editSliderFromWebsiteApi = ({ id, body }) =>
  api.put(`/website-setting/sliders/update/${id}`, body).then(res => res.data);

export const deleteSliderFromWebsiteApi = id =>
  api.delete(`/website-setting/sliders/destroy/${id}`).then(res => res.data);

// products
export const getWebsiteGroupsApi = id =>
  api.get(`/website-setting/homepage-groups/show/${id}`).then(res => res.data);

export const editGroupTitleApi = ({ id, body }) =>
  api
    .put(`/website-setting/homepage-groups/update-title/${id}`, body)
    .then(res => res.data);

export const editGroupStatusApi = ({ id, body }) =>
  api
    .put(`/website-setting/homepage-groups/update-status/${id}`, body)
    .then(res => res.data);

export const addProductToGroupApi = ({ id, body }) =>
  api
    .put(`/website-setting/homepage-groups/add-product/${id}`, body)
    .then(res => res.data);

export const removeProductFromGroupApi = ({ id, body }) =>
  api
    .put(`/website-setting/homepage-groups/delete-product/${id}`, body)
    .then(res => res.data);

// ads
export const getWebsiteAdsApi = () =>
  api.get(`/website-setting/banners/index`).then(res => res.data);

export const saveWebsiteAdsApi = body =>
  api.post(`/website-setting/banners/store`, body).then(res => res.data);




// footer
export const getFooterSettingApi = () =>
  api.get(`/website-setting/footer/index`).then(res => res.data);

export const saveFooterSettingApi = body =>
  api.post(`/website-setting/footer/store`, body).then(res => res.data);


