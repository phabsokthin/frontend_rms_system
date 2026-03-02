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
  }),

  getters: {
    isAuthenticated: (state) => !!state.token, 
    getUser: (state) => state.user,
  },

  actions: {
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
