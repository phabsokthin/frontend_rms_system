import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type PaymentType from "../types/paymentType";

export default {
  async getAll(): Promise<PaymentType[]> {
    const response = await api.get(`${API_URL}paymentType/get`);
    return response.data;
  },

  async getAllByStatus(): Promise<PaymentType[]> {
    const response = await api.get(`${API_URL}paymentType/get-active`);
    return response.data;
  },

  // create
  async create(data: PaymentType): Promise<PaymentType> {
    const response = await api.post(`${API_URL}paymentType/create`, data);
    return response.data;
  },

  // update
  async update(data: PaymentType): Promise<PaymentType> {
    if (!data._id) {
      throw new Error("ID is required");
    }

    const { _id, ...payload } = data;
    const response = await api.put<PaymentType>(
      `${API_URL}paymentType/update/${_id}`,
      payload,
    );
    return response.data;
  },

  // delete
  async delete(id: string) {
    const response = await api.delete(`${API_URL}paymentType/delete/${id}`);
    return response.data;
  },
};
