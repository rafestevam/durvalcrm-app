// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia' // Importe o Pinia
import App from './App.vue'
import router from './router'
import { keycloak, keycloakKey } from './keycloak'
import './assets/main.css'

const app = createApp(App)

const initializeApp = async () => {
  try {
    console.log("Inicializando Keycloak...");
    // Força a autenticação no carregamento da aplicação.
    const authenticated = await keycloak.init({
      onLoad: 'login-required'
    })

    console.log(`Usuário está ${authenticated ? 'autenticado' : 'não autenticado'}.`)

    if (authenticated) {
        // Disponibiliza a instância do Keycloak para todos os componentes.
        app.provide(keycloakKey, keycloak)

        // Adiciona o Pinia à instância do Vue.
        app.use(createPinia())
        
        // Usa o router e monta a aplicação APÓS a inicialização do Keycloak.
        app.use(router)
        app.mount('#app')
    } else {
        console.warn("Autenticação não realizada. A aplicação não será montada.");
    }

  } catch (error) {
    console.error('Falha ao inicializar o Keycloak', error)
    document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: sans-serif;"><h1>Erro de Autenticação</h1><p>Não foi possível conectar ao serviço de autenticação. Por favor, tente novamente mais tarde.</p></div>'
  }
}

// Inicia a aplicação.
initializeApp()