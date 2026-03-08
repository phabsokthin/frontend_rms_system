import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type Supplier from "../types/supplier";

export default {
  async getAll(): Promise<Supplier[]> {
    const response = await api.get(`${API_URL}supplier/get`);
    return response.data;
  },

  //get status
  async getAllStatus(): Promise<Supplier[]> {
    const response = await api.get(`${API_URL}supplier/get-active`);
    return response.data;
  },

  // create
  async create(data: Supplier): Promise<Supplier> {
    const response = await api.post(`${API_URL}supplier/create`, data);
    return response.data;
  },

  // update
  async update(data: Supplier): Promise<Supplier> {
    if (!data._id) {
      throw new Error("ID is required");
    }

    const { _id, ...payload } = data;
    const response = await api.put<Supplier>(
      `${API_URL}supplier/update/${_id}`,
      payload,
    );
    return response.data;
  },

  // delete
  async delete(id: string) {
    const response = await api.delete(`${API_URL}supplier/delete/${id}`);
    return response.data;
  },
};
