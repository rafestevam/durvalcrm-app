import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { keycloak, keycloakKey } from './keycloak' // Importando da versão corrigida
import './assets/main.css'

const app = createApp(App)

const initializeApp = async () => {
  try {
    console.log("Tentando inicializar o Keycloak...");
    const authenticated = await keycloak.init({
      onLoad: 'login-required'
    })

    console.log(`Keycloak init concluído. Usuário autenticado: ${authenticated}`);

    if (authenticated) {
        app.provide(keycloakKey, keycloak)
        app.use(createPinia())
        app.use(router)
        app.mount('#app')
    }

  } catch (error) {
    console.error('Falha CRÍTICA ao inicializar o Keycloak. Verifique a conexão e a configuração de CORS no seu realm.', error)
    document.body.innerHTML = '<h1>Erro ao conectar com o servidor de autenticação. Verifique o console do navegador para detalhes técnicos.</h1>';
  }
}

initializeApp()