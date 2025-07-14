import axios, { type AxiosInstance } from 'axios';
import keycloak from '../keycloak'; // Corrigido para importar a instância do keycloak.ts

// Crie uma instância base do Axios
const apiClient: AxiosInstance = axios.create({
  // A URL base da sua API Quarkus
  baseURL: 'http://localhost:8082',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Use um interceptador para adicionar o token JWT a cada requisição
apiClient.interceptors.request.use(
  (config) => {
    // Garante que o usuário está autenticado e o token está disponível
    if (keycloak && keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de resposta para lidar com a expiração do token (refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Se a resposta for 401 (Não Autorizado) e ainda não tentamos dar retry
    if (error.response.status === 401 && keycloak.token && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            // Tenta atualizar o token. O Keycloak fará o refresh se necessário.
            await keycloak.updateToken(30);
            // Atualiza o cabeçalho com o novo token e reenvia a requisição original
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
            originalRequest.headers['Authorization'] = `Bearer ${keycloak.token}`;
            return apiClient(originalRequest);
        } catch (e) {
            console.error("Não foi possível atualizar o token. Deslogando.", e);
            keycloak.logout();
        }
    }
    return Promise.reject(error);
  }
);

export default apiClient;