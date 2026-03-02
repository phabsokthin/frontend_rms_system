import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type Table from "../types/table";


export default {
  async getAll(): Promise<Table[]> {
    const response = await api.get(`${API_URL}table/get-table`);
    return response.data;
  },

  // create
  async create(category: Table): Promise<Table> {
    const response = await api.post(`${API_URL}table/create-table`, category);
    return response.data;
  },

  // update
async update(category: Table): Promise<Table> {
  if (!category._id) {
    throw new Error("ID is required");
  }

  const { _id, ...payload } = category;

  const response = await api.patch<Table>(
    `${API_URL}table/update-table/${_id}`,
    payload
  );

  return response.data;
},

  // delete
  async delete(id: string) {
    const response = await api.delete(`${API_URL}table/delete-table/${id}`);
    return response.data;
  },
};
