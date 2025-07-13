// src/services/api.ts
import axios, { type AxiosInstance } from 'axios'
import { keycloak } from '../keycloak' // Importando do novo arquivo

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptador para adicionar o token a cada requisição
apiClient.interceptors.request.use(
  (config) => {
    if (keycloak && keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptador de resposta para lidar com a expiração do token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    // Se o erro for 401, existir um refresh token e não for uma tentativa de retry
    if (error.response.status === 401 && keycloak.refreshToken && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshed = await keycloak.updateToken(30) // Tenta atualizar se o token expirar em 30s
        if (refreshed) {
          console.log('Token atualizado com sucesso.')
          return apiClient(originalRequest) // Tenta a requisição original novamente
        }
      } catch (e) {
        console.error('Não foi possível atualizar o token, fazendo logout.', e)
        keycloak.logout() // Se a atualização falhar, desloga o usuário
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient