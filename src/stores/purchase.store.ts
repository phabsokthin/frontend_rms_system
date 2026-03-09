import { defineStore } from "pinia";
import { handleApiError } from "../utils/handleError";
import type Purchase from "../types/purchase";
import purchaseService from "../services/purchaseService";

export const purchaseStore = defineStore("purchase", {
  state: () => ({
    data: [] as Purchase[],
  }),

  getters: {
    getPurchase: (state) => state.data,
  },

  actions: {
    setData(data: Purchase[]) {
      this.data = data;
    },

    // fetch dall data
    async fetchDta() {
      try {
        const data = await purchaseService.getAll();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // create table
    async createData(datas: Purchase) {
      try {
        const data = await purchaseService.create(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to create data");
      }
    },

    // update status
    async updateStatus(datas: Purchase) {
      try {
        const data = await purchaseService.updateStatus(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // update Data
    async updateData(datas: Purchase) {
      try {
        const data = await purchaseService.update(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // delete data
    async deleteData(id: string) {
      try {
        // Call API to delete
        const data = await purchaseService.delete(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete data");
      }
    },
  },
});
