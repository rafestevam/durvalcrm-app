import axios from 'axios';
import type { KeycloakInstance } from 'keycloak-js';

const apiClient = axios.create({
  baseURL: 'http://localhost:8082/', // URL base da sua API Quarkus
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupAxiosInterceptor = (keycloak: KeycloakInstance) => {
  apiClient.interceptors.request.use(
    (config) => {
      if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Opcional: Interceptador para renovar o token se expirar
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 401) {
        try {
          await keycloak.updateToken(5); // Tenta renovar o token
          // Tenta a requisição original novamente com o novo token
          return apiClient(error.config); 
        } catch (err) {
          console.error("Não foi possível renovar o token", err);
          keycloak.logout(); // Desloga se a renovação falhar
        }
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;