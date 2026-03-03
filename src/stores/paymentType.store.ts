import { defineStore } from "pinia";
import { handleApiError } from "../utils/handleError";
import type PaymentType from "../types/paymentType";
import paymentTypService from "../services/paymentTypService";


export const paymentTypeStore = defineStore("paymentType", {
  state: () => ({
    data: [] as PaymentType[], 
  }),

  getters: {
    getPaymentType: (state) => state.data,
  },

  actions: {
    setData(data: PaymentType[]) {
      this.data = data;
    },

    // fetch dall data
    async fetchDta() {
      try {
        const data = await paymentTypService.getAll();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // create table
    async createData(datas: PaymentType) {
      try {
        const data = await paymentTypService.create(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to create data");
      }
    },

    // update Data
    async updateData(datas: PaymentType) {
      try {
        const data = await paymentTypService.update(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // delete data
    async deleteData(id: string) {
      try {
        // Call API to delete
        const data = await paymentTypService.delete(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete data");
      }
    },
  },
});
