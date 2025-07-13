import axios from 'axios';
import { keycloak } from '../main'; // Importando a instância do Keycloak

const api = axios.create({
  baseURL: 'http://localhost:8082', // URL base do seu backend Quarkus
});

// Adiciona um interceptor para injetar o token JWT em cada requisição
api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated && keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;