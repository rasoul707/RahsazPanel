import api from "./Api";

export const initialDashboardPageApi = () =>
  api.get("/dashboard/index").then(res => res.data);
