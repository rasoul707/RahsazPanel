import api from "./Api";

export const getOrders = params =>
  api.get("/orders/index", { params }).then(res => res.data);

export const getOrderProducts = params =>
  api.get(`/orders/show-products/${params.id}`).then(res => res.data);

export const getOrderShow = id =>
  api.get(`/orders/show/${id}`).then(res => res.data);

export const deleteOrders = id =>
  api.delete(`/orders/destroy/${id}`).then(res => res);

export const getLogs = id =>
  api.get(`/orders/show-logs/${id}`).then(res => res.data);
export const getSmsLogs = id =>
  api.get(`/orders/show-sms-logs/${id}`).then(res => res.data);

export const sendSms = data => {
  return api
    .post("/sms/send-single-sms", {}, { params: data })
    .then(res => res);
};

export const updateBijak = ({ id, bijak_image_id, bijak_note }) => {
  return api
    .post(
      `/orders/update-bijak/${id}`,
      {},
      { params: { bijak_image_id, bijak_note } },
    )
    .then(res => res);
};

export const getAddressId=(id)=>{
  return api.get(`/customers/addresses/${id}`).then(res=>res.data)
}

export const updateOrderStatus= id => {
  return api
    .post(`/orders/update-product-status/${id}`, {}, { params:{
      status:"مرجوعی"
    } })
    .then(res => res);
};

export const updateOrder= (data,id) => {
  return api
    .post(`/orders/update/${id}`, data)
    .then(res => res);
};

export const getStatics=()=>{
  return api.get('/orders/statics').then(res=>res.data)
}