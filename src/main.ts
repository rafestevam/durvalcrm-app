// src/main.ts

import { createApp } from 'vue';
import App from './App.vue';
// NÃO importe o router aqui no topo ainda
// import router from './router'; 
import keycloak from './keycloak';
import './assets/main.css';
import { vMaska } from 'maska/vue';

const initializeApp = async () => {
  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      flow: 'standard',
      responseMode: 'query',
      pkceMethod: 'S256',
      // Garanta que o silent-check-sso.html está acessível publicamente
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    });

    console.log(`Keycloak authenticated: ${authenticated}`);

    if (authenticated) {
      // 1. Somente após a autenticação, importe e crie o router.
      const { default: router } = await import('./router');

      // 2. Crie a instância do Vue.
      const app = createApp(App);

      // 3. Forneça o Keycloak para toda a aplicação.
      app.provide('keycloak', keycloak);

      // 4. Use o router.
      app.use(router);
      
      // 5. Registre diretivas ou outros plugins.
      app.directive('maska', vMaska);

      // 6. Monte a aplicação.
      app.mount('#app');
    } else {
      // Este `else` geralmente não será alcançado com `onLoad: 'login-required'`,
      // mas é uma boa prática para depuração.
      console.warn("Usuário não autenticado. A aplicação não será montada.");
      document.body.innerHTML = '<h2>Você não está autorizado.</h2><p>Por favor, tente fazer o login novamente.</p>';
    }

  } catch (error) {
    console.error('Falha catastrófica ao inicializar o Keycloak:', error);
    document.body.innerHTML = '<h2>Erro Crítico na Inicialização</h2><p>Não foi possível conectar ao sistema de autenticação. Por favor, contate o suporte.</p>';
  }
};

initializeApp();