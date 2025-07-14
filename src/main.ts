import { createApp, type InjectionKey } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import keycloak from './keycloak';
import './style.css';

export const keycloakKey: InjectionKey<typeof keycloak> = Symbol('keycloak');

const app = createApp(App);

console.log('Iniciando aplicação...');

// Inicializa o Keycloak para verificar se já existe uma sessão (check-sso)
keycloak.init({
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  
  // ✅ ESTA LINHA É ESSENCIAL E RESOLVE O ERRO DOS SEUS LOGS
  pkceMethod: 'S256', 
  
  enableLogging: true
})
.then((authenticated) => {
  console.log(`Keycloak inicializado. Autenticado: ${authenticated}`);
  
  app.provide(keycloakKey, keycloak);
  app.use(createPinia());
  app.use(router);
  app.mount('#app');
})
.catch((error) => {
  console.error('Falha catastrófica ao inicializar o Keycloak. Detalhes:', error);
  document.body.innerHTML = '<h1>Erro ao conectar com o serviço de autenticação.</h1>';
});