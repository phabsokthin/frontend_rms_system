import { defineStore } from "pinia";
import { handleApiError } from "../utils/handleError";
import type Expense from "../types/expense";
import expenseService from "../services/expenseService";

export const expenseStore = defineStore("expense", {
  state: () => ({
    data: [] as Expense[], 
  }),

  getters: {
    getExpense: (state) => state.data,
  },

  actions: {
    setData(data: Expense[]) {
      this.data = data;
    },

    // fetch dall data
    async fetchDta() {
      try {
        const data = await expenseService.getAll();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },


    // create table
    async createData(datas: Expense) {
      try {
        const data = await expenseService.create(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to create data");
      }
    },

    // update Data
    async updateData(datas: Expense) {
      try {
        const data = await expenseService.update(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // delete data
    async deleteData(id: string) {
      try {
        // Call API to delete
        const data = await expenseService.delete(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete data");
      }
    },
  },
});
