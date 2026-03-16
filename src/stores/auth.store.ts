import { defineStore } from "pinia";
import type UserAuth from "../types/auth";
import authService from "../services/authService";
import { handleApiError } from "../utils/handleError";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    data: [] as UserAuth[],
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getAllUser: (state) => state.data,
  },

  actions: {
    setData(data: UserAuth[]) {
      this.data = data;
    },
    async login(payload: UserAuth) {
      try {
        this.error = null;
        const data = await authService.login(payload);
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return data;
      } catch (error: unknown) {
        handleApiError(error, "Login failed"); // just throw
      }
    },

        // create category
        async createUser(user: UserAuth) {
          try {
            const data = await authService.create(user);
            return data;
          } catch (error) {
            handleApiError(error, "Failed to create category");
          }
        },
    

    // fetch dall data
    async fetchAllUser() {
      try {
        const data = await authService.getUser();
        this.setData(data);
      } catch (error) {
        handleApiError(error, "Failed to fetch data");
      }
    },

    // // update Data
    async updateData(user: UserAuth) {
      try {
        const data = await authService.update(user);
        return data;
      } catch (error) {
        handleApiError(error, "Failed to update data");
      }
    },

    // delete data
    async deleteData(id: string) {
      try {
        // Call API to delete
        const data = await authService.delete(id);

        return data;
      } catch (error) {
        handleApiError(error, "Failed to delete data");
      }
    },

    async logout() {
      try {
        this.user = null;
        this.token = null;
        await authService.logout();
        // localStorage.removeItem("token");
        localStorage.clear();
      } catch (error: unknown) {
        handleApiError(error, "Logout failed");
      }
    },
  },
});
