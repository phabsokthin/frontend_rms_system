import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type Staff from "../types/staff";


export default {
  async getAll(): Promise<Staff[]> {
    const response = await api.get(`${API_URL}staff/get-staff`);
    return response.data;
  },

  async getAllByStatus(): Promise<Staff[]> {
    const response = await api.get(`${API_URL}staff/get-active`);
    return response.data;
  },

  // create
  async create(data: Staff): Promise<Staff> {
    const response = await api.post(`${API_URL}staff/create-staff`, data);
    return response.data;
  },

  // update
  async update(data: Staff): Promise<Staff> {
    if (!data._id) {
      throw new Error("ID is required");
    }

    const { _id, ...payload } = data;
    const response = await api.put<Staff>(
      `${API_URL}staff/update-staff/${_id}`,
      payload,
    );
    return response.data;
  },

  // delete
  async delete(id: string) {
    const response = await api.delete(`${API_URL}staff/delete-staff/${id}`);
    return response.data;
  },
};
