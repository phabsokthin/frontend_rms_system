import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type Product from "../types/product";

export default {
  async getAll(): Promise<Product[]> {
    const response = await api.get(`${API_URL}product/get`);
    return response.data;
  },

    async getAllByStatus(): Promise<Product[]> {
    const response = await api.get(`${API_URL}product/get-product-true`);
    return response.data;
  },

  // get manage stock
    async getManageStock(): Promise<Product[]> {
    const response = await api.get(`${API_URL}product/get-manage-stock`);
    return response.data;
  },

  // create
  async create(data: Product): Promise<Product> {
    const response = await api.post(`${API_URL}product/create`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },


  // update
  // async update(data: Product): Promise<Product> {
  //   if (!data._id) {
  //     throw new Error("ID is required");
  //   }

  //   const { _id, ...payload } = data;
  //   const response = await api.put<Product>(
  //     `${API_URL}product/update/${_id}`,
  //     payload,
  //   );
  //   return response.data;
  // },

  async update(data: Product | FormData): Promise<Product> {
    let id: string;
    let payload: any;

    // Check if data is FormData
    if (data instanceof FormData) {
      // FormData already contains _id
      id = data.get("_id") as string;
      payload = data;
    } else {
      // Plain JSON
      if (!data._id) throw new Error("ID is required");
      id = data._id;
      const { _id, ...rest } = data;
      payload = rest;
    }

    const response = await api.put<Product>(
      `${API_URL}product/update/${id}`,
      payload,
      payload instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    );

    return response.data;
  },

  // delete
  async delete(id: string) {
    const response = await api.delete(`${API_URL}product/delete/${id}`);
    return response.data;
  },
};
