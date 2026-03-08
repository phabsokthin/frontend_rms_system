import { defineStore } from "pinia";
import { handleApiError } from "../utils/handleError";
import type Table from "../types/table";
import tableService from "../services/tableService";

export const tableStore = defineStore("table", {
  state: () => ({
    table: [] as Table[], // typed array
  }),

  getters: {
    getTatble: (state) => state.table,
  },

  actions: {
    setData(table: Table[]) {
      this.table = table;
    },

    // fetch dall data
    async fetchDta() {
      try {
        const data = await tableService.getAll();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // fetch dall data
    async fetchDataByActive() {
      try {
        const data = await tableService.getAllByStatus();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // create table
    async createData(table: Table) {
      try {
        const data = await tableService.create(table);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to create data");
      }
    },

    // update Data
    async updateData(table: Table) {
      try {
        const data = await tableService.update(table);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // update Data
    async updateStatus(table: Table) {
      try {
        const data = await tableService.updateStatus(table);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // delete data
    async deleteData(id: string) {
      try {
        // Call API to delete
        const data = await tableService.delete(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete data");
      }
    },
  },
});
