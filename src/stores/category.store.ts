import { defineStore } from "pinia";
import type Category from "../types/category";
import categoryService from "../services/categoryService";
import { handleApiError } from "../utils/handleError";

export const categoryStore = defineStore("category", {
  state: () => ({
    category: [] as Category[], // typed array
  }),

  getters: {
    getCategories: (state) => state.category,
  },

  actions: {
    setData(categories: Category[]) {
      this.category = categories;
    },

    // fetch dall categories
    async fetchCategories() {
      try {
        const categories = await categoryService.getCategories();
        this.setData(categories);
      } catch (error) {
        handleApiError(error, "Failed to fetch categories");
      }
    },

    // create category
    async createCategory(category: Category) {
      try {
        const data = await categoryService.createCategory(category);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to create category");
      }
    },

    // update Data
    async updateCategory(category: Category) {
      try {
        const data = await categoryService.updateCategory(category);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update category");
      }
    },

    // delete category
    async deleteCategory(id: string) {
      try {
        // Call API to delete
        const data = await categoryService.deleteCategory(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete category");
      }
    },
  },
});
