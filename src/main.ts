import { createApp, type InjectionKey } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import keycloak from './keycloak'; // Importando a instância isolada e corrigida
import './style.css'; // Usando o 'style.css' principal do projeto

// A InjectionKey é uma ótima prática para injeção de dependência tipada.
export const keycloakKey: InjectionKey<typeof keycloak> = Symbol('keycloak');

const app = createApp(App);

// Função para inicializar a aplicação
const initializeApp = async () => {
  try {
    // Usando a instância importada do keycloak
      const authenticated = await keycloak.init({ 
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      enableLogging: true
});

    console.log(`Usuário está ${authenticated ? 'autenticado' : 'não autenticado'}.`);

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