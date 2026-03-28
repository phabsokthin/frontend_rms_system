import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type SellOrder from "../types/sellOrder";

export default {
  async getAll(): Promise<SellOrder[]> {
    const response = await api.get(`${API_URL}sellOrder/get`);
    return response.data;
  },

  async getId(id: string): Promise<SellOrder> {
    const response = await api.get(`${API_URL}sellOrder/get/${id}`);
    return response.data;
  },

  async getAllByStatus(): Promise<SellOrder[]> {
    const response = await api.get(`${API_URL}sellOrder/get-active`);
    return response.data;
  },

  async getAllByStatusPending(): Promise<SellOrder[]> {
    const response = await api.get(`${API_URL}sellOrder/get-pending`);
    return response.data;
  },

  async getAllByStatusDone(): Promise<SellOrder[]> {
    const response = await api.get(`${API_URL}sellOrder/get-done`);
    return response.data;
  },

  // create
  async create(data: SellOrder): Promise<SellOrder> {
    const response = await api.post(`${API_URL}sellOrder/create`, data);
    return response.data;
  },

  // update
  async update(data: SellOrder): Promise<SellOrder> {
    if (!data._id) {
      throw new Error("ID is required");
    }

    const { _id, ...payload } = data;
    const response = await api.put<SellOrder>(
      `${API_URL}sellOrder/update/${_id}`,
      payload,
    );
    return response.data;
  },

  async updateToProcessing(data: SellOrder): Promise<SellOrder> {
    if (!data._id) {
      throw new Error("ID is required");
    }

    const { _id, ...payload } = data;
    const response = await api.patch<SellOrder>(
      `${API_URL}sellOrder/update/${_id}/processing`,
      payload,
    );
    return response.data;
  },

  async updateToDone(data: SellOrder): Promise<SellOrder> {
    if (!data._id) {
      throw new Error("ID is required");
    }

    const { _id, ...payload } = data;
    const response = await api.patch<SellOrder>(
      `${API_URL}sellOrder/update/${_id}/done`,
      payload,
    );
    return response.data;
  },


  async updateToPaid(data: SellOrder): Promise<SellOrder> {
    if (!data._id) {
      throw new Error("ID is required");
    }
    const { _id, ...payload } = data;
    const response = await api.patch<SellOrder>(
      `${API_URL}sellOrder/update/${_id}/paid`,
      payload,
    );
    return response.data;
  },

  // delete
  async delete(id: string) {
    const response = await api.delete(`${API_URL}sellOrder/delete/${id}`);
    return response.data;
  },
};
