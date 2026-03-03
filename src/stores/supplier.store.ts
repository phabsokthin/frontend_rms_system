import { defineStore } from "pinia";
import { handleApiError } from "../utils/handleError";
import type Supplier from "../types/supplier";
import supplierService from "../services/supplierService";

export const supplierStore = defineStore("supplier", {
  state: () => ({
    data: [] as Supplier[], 
  }),

  getters: {
    getSupplier: (state) => state.data,
  },

  actions: {
    setData(data: Supplier[]) {
      this.data = data;
    },

    // fetch dall data
    async fetchDta() {
      try {
        const data = await supplierService.getAll();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // create table
    async createData(datas: Supplier) {
      try {
        const data = await supplierService.create(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to create data");
      }
    },

    // update Data
    async updateData(datas: Supplier) {
      try {
        const data = await supplierService.update(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // delete data
    async deleteData(id: string) {
      try {
        // Call API to delete
        const data = await supplierService.delete(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete data");
      }
    },
  },
});
