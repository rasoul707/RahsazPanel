import api from "./Api";

export const getMyTeamApi = params =>
  api.get(`/sub-admins/index`, { params }).then(res => res.data);

export const getMyTeamPermissionsApi = id =>
  api
    .get(`/sub-admins/show-permissions`, { params: { id } })
    .then(res => res.data);

export const getMemberOfMyTeamApi = id =>
  api.get(`/sub-admins/show/${id}`).then(res => res.data);

export const addMemberToMyTeamApi = body =>
  api.post(`/sub-admins/store`, body).then(res => res.data);

export const editMemberOfMyTeamApi = ({ id, body }) =>
  api.put(`/sub-admins/update/${id}`, body).then(res => res.data);

export const removeMemberApi = id =>
  api.delete(`/sub-admins/destroy/${id}`).then(res => res.data);
