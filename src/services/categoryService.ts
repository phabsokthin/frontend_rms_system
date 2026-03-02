import api from "../api/apiConfig";
import { API_URL } from "../config/config";
import type Category from "../types/category";


export default {
  async getCategories(): Promise<Category[]> {
    const response = await api.get(`${API_URL}category/get-category`);
    return response.data;
  },

  // create
  async createCategory(category: Category): Promise<Category> {
    const response = await api.post(`${API_URL}category/post-category`, category);
    return response.data;
  },

  // update
async updateCategory(category: Category): Promise<Category> {
  if (!category._id) {
    throw new Error("ID is required");
  }

  const { _id, ...payload } = category;

  const response = await api.put<Category>(
    `${API_URL}category/update-category/${_id}`,
    payload
  );

  return response.data;
},

  // delete
  async deleteCategory(id: string) {
    const response = await api.delete(`${API_URL}category/delete-category/${id}`);
    return response.data;
  },
};
