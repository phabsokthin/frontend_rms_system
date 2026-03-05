import { defineStore } from "pinia";
import { handleApiError } from "../utils/handleError";
import type Product from "../types/product";
import productService from "../services/productService";



export const producStore = defineStore("product", {
  state: () => ({
    data: [] as Product[], 
  }),

  getters: {
    getProduct: (state) => state.data,
  },

  actions: {
    setData(data: Product[]) {
      this.data = data;
    },

    // fetch dall data
    async fetchDta() {
      try {
        const data = await productService.getAll();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    
     async fetchDtaByStatus() {
      try {
        const data = await productService.getAllByStatus();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },


    // create table
    async createData(datas: Product) {
      try {
        const data = await productService.create(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to create data");
      }
    },

    // update Data
    async updateData(datas: Product) {
      try {
        const data = await productService.update(datas);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // delete data
    async deleteData(id: string) {
      try {
        // Call API to delete
        const data = await productService.delete(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete data");
      }
    },
  },
});
