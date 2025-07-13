import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Keycloak from 'keycloak-js';
import './assets/main.css';

// Configuração do Keycloak
const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'durval-crm',
  clientId: 'durvalcrm-app'
});

// Tornando a instância do Keycloak exportável para ser usada em outros lugares (como no api.ts)
export { keycloak };

// Função para montar a aplicação Vue
const mountApp = () => {
  const app = createApp(App);
  app.use(router);
  app.mount('#app');
};

// Inicializa o Keycloak e DEPOIS monta a aplicação
keycloak.init({ 
  onLoad: 'login-required',
  pkceMethod: 'S256' 
}).then((authenticated) => {
    if (authenticated) {
      console.log("Usuário autenticado.");
      mountApp(); // Monta a aplicação somente se a autenticação for bem-sucedida
    } else {
      console.warn("Usuário não autenticado.");
      // O Keycloak já deve ter redirecionado para a tela de login
      // mas podemos adicionar um fallback se necessário.
      // window.location.reload(); 
    }
  })
  .catch((error) => {
    console.error("Falha ao inicializar o Keycloak", error);
    // Em caso de erro, podemos exibir uma mensagem amigável na tela
    document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: sans-serif;"><h1>Erro</h1><p>Não foi possível conectar ao serviço de autenticação. Tente novamente mais tarde.</p></div>';
  });