import { createApp, type InjectionKey } from 'vue';
import { createPinia } from 'pinia'; // Adicionado de volta
import App from './App.vue';
import router from './router'; // Adicionado de volta
import Keycloak from 'keycloak-js';
import './assets/main.css'; // Renomeado de 'style.css' para consistência
import { setupAxiosInterceptor } from './services/api';

// É recomendado criar uma InjectionKey para garantir que a injeção de dependência 
// seja totalmente tipada em toda a aplicação.
export const keycloakKey: InjectionKey<Keycloak> = Symbol('keycloak');

const app = createApp(App);

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'durval-crm',
  clientId: 'durvalcrm-app'
});

// Função para inicializar a aplicação
const initializeApp = async () => {
  try {
    const authenticated = await keycloak.init({ 
      onLoad: 'login-required' 
    });

    console.log(`Usuário está ${authenticated ? 'autenticado' : 'não autenticado'}.`);

    if (authenticated) {
      setupAxiosInterceptor(keycloak);
    }

    app.provide(keycloakKey, keycloak);
    app.use(createPinia());
    app.use(router);
    app.mount('#app');

  } catch (error) {
    console.error('Falha ao inicializar o Keycloak', error);
    document.body.innerHTML = '<h1>Erro ao conectar com o serviço de autenticação.</h1>';
  }
};

initializeApp();