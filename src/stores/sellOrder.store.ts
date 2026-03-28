import { defineStore } from "pinia";
import { handleApiError } from "../utils/handleError";
import type SellOrder from "../types/sellOrder";
import sellOrderService from "../services/sellOrderService";


export const sellOrderStore = defineStore("sellOrder", {
  state: () => ({
    data: [] as SellOrder[], 
  }),

  getters: {
    getSellOrder: (state) => state.data,
    getSellById: (state) => (id: string) => state.data.find((item) => item._id === id),
  },

  actions: {
    setData(data: SellOrder[]) {
      this.data = data;
    },

    // fetch dall data
    async fetchDta() {
      try {
        const data = await sellOrderService.getAll();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    async fetchById(id: string) {
      try {
        const data = await sellOrderService.getId(id);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // fetch dall data
    async fetchDtaByStatus() {
      try {
        const data = await sellOrderService.getAllByStatus();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // fetch dall data
    async fetchDataByPending() {
      try {
        const data = await sellOrderService.getAllByStatusPending();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // fetch dall data
    async fetchDataByDone() {
      try {
        const data = await sellOrderService.getAllByStatusDone();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // create table
    async createData(datas: SellOrder) {
      try {
        const data = await sellOrderService.create(datas);
        await this.fetchDta();
        return data;
      } catch (error) {
        handleApiError(error, "Failed to create data");
      }
    },

    // update Data
    async updateData(datas: SellOrder) {
      try {
        const data = await sellOrderService.update(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // update status
    async updateStatusProccessing(datas: SellOrder) {
      try {
        const data = await sellOrderService.updateToProcessing(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // update status
    async updateStatusDone(datas: SellOrder) {
      try {
        const data = await sellOrderService.updateToDone(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

     // update status paid
    async updateStatusPaid(datas: SellOrder) {
      try {
        const data = await sellOrderService.updateToPaid(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // delete data
    async deleteData(id: string) {
      try {
        // Call API to delete
        const data = await sellOrderService.delete(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete data");
      }
    },
  },
});
