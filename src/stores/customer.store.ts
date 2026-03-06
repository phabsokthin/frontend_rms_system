import { defineStore } from "pinia";
import { handleApiError } from "../utils/handleError";
import type Customer from "../types/customer";
import customerService from "../services/customerService";



export const customerStore = defineStore("customer", {
  state: () => ({
    data: [] as Customer[], // typed array
  }),

  getters: {
    getCustomer: (state) => state.data,
  },

  actions: {
    setData(data: Customer[]) {
      this.data = data;
    },

    // fetch dall data
    async fetchDta() {
      try {
        const data = await customerService.getAll();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // fetch dall data
    async fetchDtaByStatus() {
      try {
        const data = await customerService.getAllByStatus();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // create table
    async createData(datas: Customer) {
      try {
        const data = await customerService.create(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to create data");
      }
    },

    // update Data
    async updateData(datas: Customer) {
      try {
        const data = await customerService.update(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // delete data
    async deleteData(id: string) {
      try {
        // Call API to delete
        const data = await customerService.delete(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete data");
      }
    },
  },
});
