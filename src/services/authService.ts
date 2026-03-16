import { API_URL } from "../config/config";
import type UserAuth from "../types/auth";
import api from "../api/apiConfig";

export default {
  async login(payload: UserAuth) {
    const response = await api.post(`${API_URL}auth/login`, payload);
    return response.data;
  },

  async create(payload: UserAuth) {
    const response = await api.post(`${API_URL}auth/create-user`, payload);
    return response.data;
  },
  //get user
  async getUser(): Promise<UserAuth[]> {
    const response = await api.get(`${API_URL}auth/get-users`);
    return response.data;
  },

  // update
  async update(data: UserAuth): Promise<UserAuth> {
    if (!data._id) {
      throw new Error("ID is required");
    }

    const { _id, ...payload } = data;
    const response = await api.put<UserAuth>(
      `${API_URL}auth/update-user/${_id}`,
      payload,
    );
    return response.data;
  },

  // delete
  async delete(id: string) {
    const response = await api.delete(`${API_URL}auth/delete-user/${id}`);
    return response.data;
  },

  async logout() {
    const response = await api.post(`${API_URL}auth/logout`);
    return response.data;
  },
};
