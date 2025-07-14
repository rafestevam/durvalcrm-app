import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import keycloak from './keycloak'; // Importando a instância centralizada
import './assets/main.css'; // Tailwind CSS
import { vMaska } from 'maska/vue'; // Importando a diretiva Maska

// Função de inicialização assíncrona
const initializeApp = async () => {
  try {
    // Inicializa o Keycloak. A opção 'login-required' força a autenticação
    // antes de qualquer outra coisa ser carregada.
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256' // Essencial para a segurança do fluxo
    });

    console.log(`Usuário ${authenticated ? 'autenticado' : 'não autenticado'}.`);

    // Se autenticado, monta a aplicação Vue
    if (authenticated) {
      const app = createApp(App);

      // Disponibiliza a instância do Keycloak para toda a aplicação
      app.provide('keycloak', keycloak);

      // Usa os plugins
      app.use(router);
      app.directive('maska', vMaska); // Registrando a diretiva Maska globalmente

      // Monta a aplicação
      app.mount('#app');
    }

  } catch (error) {
    console.error('Falha catastrófica ao inicializar o Keycloak:', error);
    // Exibe uma mensagem de erro clara para o usuário final
    document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: sans-serif;"><h1>Erro de Autenticação</h1><p>Não foi possível conectar ao serviço de autenticação. Por favor, verifique se o Keycloak está em execução e tente novamente.</p></div>';
  }
};

// Inicia o processo
initializeApp();