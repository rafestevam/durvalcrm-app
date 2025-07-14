// src/main.ts
import { createApp, type InjectionKey } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './router'; // Importa apenas as rotas
import App from './App.vue';
import keycloak from './keycloak';
import './style.css';

export const keycloakKey: InjectionKey<typeof keycloak> = Symbol('keycloak');

console.log('Iniciando verificação de sessão com Keycloak...');

// Usamos 'check-sso' para verificar a sessão silenciosamente
keycloak.init({
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256',
})
.then((authenticated) => {
  // Se o usuário já estiver logado, montamos a app
  if (authenticated) {
    console.log('Usuário autenticado. Montando a aplicação Vue...');
    mountApp();
  } else {
    // Se não estiver logado, disparamos o login manualmente.
    // Isso evita o loop, pois a decisão é tomada após a verificação inicial.
    console.warn('Usuário não autenticado. Redirecionando para a página de login.');
    keycloak.login();
  }
})
.catch((error) => {
  console.error('Falha catastrófica ao inicializar o Keycloak:', error);
  document.body.innerHTML = '<h1>Erro crítico de autenticação. Não foi possível conectar ao servidor.</h1>';
});

/**
 * Função para montar a aplicação Vue.
 * Isso só é chamado após a autenticação ser confirmada.
 */
function mountApp() {
  const app = createApp(App);

  app.provide(keycloakKey, keycloak);
  app.use(createPinia());

  // O roteador é criado e usado aqui dentro, de forma segura.
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
  });
  app.use(router);

  app.mount('#app');
}