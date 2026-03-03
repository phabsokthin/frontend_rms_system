import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type Customer from "../types/customer";



export default {
  async getAll(): Promise<Customer[]> {
    const response = await api.get(`${API_URL}customer/get`);
    return response.data;
  },

  // create
  async create(data: Customer): Promise<Customer> {
    const response = await api.post(`${API_URL}customer/create`, data);
    return response.data;
  },

  // update
  async update(data: Customer): Promise<Customer> {
    if (!data._id) {
      throw new Error("ID is required");
    }

    const { _id, ...payload } = data;
    const response = await api.put<Customer>(
      `${API_URL}customer/update/${_id}`,
      payload,
    );
    return response.data;
  },

  // delete
  async delete(id: string) {
    const response = await api.delete(`${API_URL}customer/delete/${id}`);
    return response.data;
  },
};
