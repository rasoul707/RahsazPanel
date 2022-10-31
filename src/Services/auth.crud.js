import { apiwithoutUserRole } from "./Api";

export const loginUser = body =>
  apiwithoutUserRole
    .post(`/login-via-email`, JSON.stringify(body))
    .then(res => res.data);

export const registerUser = body =>
  apiwithoutUserRole.post(`/users/register`, JSON.stringify(body));
