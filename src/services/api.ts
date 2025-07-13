// src/services/api.ts
import axios, { type AxiosInstance } from 'axios'
import { keycloak } from '../keycloak'

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Adiciona o token em cada requisição
apiClient.interceptors.request.use(
  (config) => {
    if (keycloak && keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`
    }
    return config
  }
)

// Lida com a expiração do token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && keycloak.refreshToken && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await keycloak.updateToken(30)
        return apiClient(originalRequest)
      } catch (e) {
        keycloak.logout()
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient