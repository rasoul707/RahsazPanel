import api from "./Api";

export const getOrdersReportApi = params =>
  api.get("/reports/orders", { params }).then(res => res.data);

export const getCustomersReportApi = params =>
  api.get("/reports/customers", { params }).then(res => res.data);

export const getStoreRoomReportApi = params =>
  api.get("/reports/store-room", { params }).then(res => res.data);
