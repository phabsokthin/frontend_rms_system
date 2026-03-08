import { defineStore } from "pinia"
import { handleApiError } from "../utils/handleError"
import type Product from "../types/product"
import productService from "../services/productService"

export const producStore = defineStore("product", {
  state: () => ({
    data: [] as Product[],
  }),

  getters: {
    // Returns the products array
    getProduct: (state) => state.data || [],
  },

  actions: {
    setData(data: Product[]) {
      this.data = Array.isArray(data) ? data : []
    },

    // Fetch all products
    async fetchDta() {
      try {
        const data = await productService.getAll()
        this.setData(data)
      } catch (error) {
        handleApiError(error, "Failed to fetch all products")
      }
    },

    // Fetch products by active status
    async fetchDtaByStatus() {
      try {
        const data = await productService.getAllByStatus()
        this.setData(data)
      } catch (error) {
        handleApiError(error, "Failed to fetch active products")
      }
    },

    // Fetch products that are managed in stock
    async fetchManageStock() {
      try {
        const data = await productService.getManageStock()
        this.setData(data)
      } catch (error) {
        handleApiError(error, "Failed to fetch stock-managed products")
      }
    },

    // Create a new product
    async createData(datas: Product) {
      try {
        const data = await productService.create(datas)
        return data
      } catch (error) {
        handleApiError(error, "Failed to create product")
      }
    },

    // Update existing product
    async updateData(datas: Product) {
      try {
        const data = await productService.update(datas)
        return data
      } catch (error) {
        handleApiError(error, "Failed to update product")
      }
    },

    // Delete product
    async deleteData(id: string) {
      try {
        const data = await productService.delete(id)
        return data
      } catch (error) {
        handleApiError(error, "Failed to delete product")
      }
    },
  },
})