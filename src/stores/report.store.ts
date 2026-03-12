import { defineStore } from "pinia";
import { handleApiError } from "../utils/handleError";
import type Product from "../types/product";
import reportService from "../services/reportService";

export const reportStore = defineStore("report", {
  state: () => ({
    data: [] as Product[],
  }),

  getters: {
    // return all report
    getReport: (state) => state.data || [],
  },

  actions: {
    setData(data: Product[]) {
      this.data = Array.isArray(data) ? data : [];
    },

    // Fetch all products report
    async fetchProductReport() {
      try {
        const data = await reportService.getProductReport();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch all report");
      }
    },

    async fetchSellOrderReport() {
      try {
        const data = await reportService.getSellOrderReport();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch all report");
      }
    },
  },
});
