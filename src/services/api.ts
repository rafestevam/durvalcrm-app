import axios, { type AxiosInstance} from 'axios';
import { keycloak } from '../main'; // Importando a instância do Keycloak

// Crie uma instância base do Axios
const apiClient: AxiosInstance = axios.create({
  // A URL base da sua API Quarkus pode ser definida aqui
  baseURL: 'http://localhost:8081', // Ou a porta que sua API usa
  headers: {
    'Content-Type': 'application/json'
  }
});

// Use um interceptador para adicionar o token JWT a cada requisição
apiClient.interceptors.request.use(
  (config) => {
    // Verifique se o usuário está autenticado
    if (keycloak && keycloak.token) {
      // Adicione o cabeçalho de autorização
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de resposta (opcional, mas bom para lidar com refresh de token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && keycloak && !error.config._retry) {
        error.config._retry = true;
        try {
            await keycloak.updateToken(5); // Tenta atualizar o token se ele expirar em 5s
            return apiClient(error.config);
        } catch (e) {
            console.error("Não foi possível atualizar o token", e);
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
  }
);


// Exporte a instância configurada do Axios
export default apiClient;