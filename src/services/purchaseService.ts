import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type Purchase from "../types/purchase";




export default {
  async getAll(): Promise<Purchase[]> {
    const response = await api.get(`${API_URL}purchase/get`);
    return response.data;
  },

  // create
  async create(data: Purchase): Promise<Purchase> {
    const response = await api.post(`${API_URL}purchase/create`, data);
    return response.data;
  },

  // update
  async update(data: Purchase): Promise<Purchase> {
    if (!data._id) {
      throw new Error("ID is required");
    }

    const { _id, ...payload } = data;
    const response = await api.put<Purchase>(
      `${API_URL}purchase/update/${_id}`,
      payload,
    );
    return response.data;
  },

  // delete
  async delete(id: string) {
    const response = await api.delete(`${API_URL}purchase/delete/${id}`);
    return response.data;
  },
};
