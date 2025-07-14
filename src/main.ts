// src/main.ts

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { keycloak, keycloakKey } from './keycloak';
import './assets/main.css';

console.log("Iniciando processo de autenticação...");

// 1. Inicializa o Keycloak e DEIXA ELE TERMINAR PRIMEIRO.
keycloak.init({ 
    onLoad: 'check-sso', 
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' 
})
  .then((authenticated) => {
    // 2. Este bloco .then() SÓ RODA DEPOIS que o Keycloak processou o redirecionamento
    //    e a URL já está limpa.
    console.log(`Keycloak init concluído. Usuário autenticado: ${authenticated}`);

    // 3. Agora, com o Keycloak pronto, podemos iniciar o Vue com segurança.
    const app = createApp(App);

    app.use(createPinia());
    app.provide(keycloakKey, keycloak); // Fornece a instância do Keycloak para os componentes
    app.use(router); // O router agora é iniciado com o status de autenticação correto
    
    app.mount('#app');
  })
  .catch((error) => {
    console.error('Falha CRÍTICA na inicialização do Keycloak.', error);
    document.body.innerHTML = '<h1>Erro crítico ao conectar com o servidor de autenticação. Verifique o console.</h1>';
  });