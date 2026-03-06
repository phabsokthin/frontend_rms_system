import { defineStore } from "pinia";
import { handleApiError } from "../utils/handleError";
import type Staff from "../types/staff";
import staffService from "../services/staffService";

export const staffStore = defineStore("staff", {
  state: () => ({
    data: [] as Staff[], // typed array
  }),

  getters: {
    getStaff: (state) => state.data,
  },

  actions: {
    setData(data: Staff[]) {
      this.data = data;
    },

    // fetch dall data
    async fetchDta() {
      try {
        const data = await staffService.getAll();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // fetch dall data
    async fetchDtaByStatus() {
      try {
        const data = await staffService.getAllByStatus();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // create table
    async createData(datas: Staff) {
      try {
        const data = await staffService.create(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to create data");
      }
    },

    // update Data
    async updateData(datas: Staff) {
      try {
        const data = await staffService.update(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // delete data
    async deleteData(id: string) {
      try {
        // Call API to delete
        const data = await staffService.delete(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete data");
      }
    },
  },
});
