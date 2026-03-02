import { API_URL } from "../config/config"
import type UserAuth from "../types/auth"
import api from "../api/apiConfig"

export default {

  async login(payload: UserAuth) {
    const response = await api.post(`${API_URL}auth/login`, payload)
    return response.data
  },
  
  async logout() {
    const response = await api.post(`${API_URL}auth/logout`)
    return response.data
  }

}