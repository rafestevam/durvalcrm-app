// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { keycloak, keycloakKey } from './keycloak'
import './assets/main.css'

const app = createApp(App)

const initializeApp = async () => {
  try {
    console.log('Inicializando Keycloak...')
    
    // Mudança principal: usar 'check-sso' em vez de 'login-required'
    // Isso verifica se o usuário já está logado sem forçar login imediatamente
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      checkLoginIframe: false, // Desabilita o iframe check para evitar problemas
      flow: 'standard' // Usa o fluxo padrão de autorização
    })

    console.log(`Keycloak inicializado. Usuário está ${authenticated ? 'autenticado' : 'não autenticado'}.`)

    // Disponibiliza a instância do Keycloak para todos os componentes
    app.provide(keycloakKey, keycloak)

    // Configura interceptadores do token
    if (authenticated) {
      console.log('Token válido encontrado:', keycloak.token ? 'Sim' : 'Não')
      
      // Configura refresh automático do token
      setInterval(() => {
        keycloak.updateToken(70).then((refreshed) => {
          if (refreshed) {
            console.log('Token foi atualizado')
          }
        }).catch(() => {
          console.log('Falha ao atualizar token')
        })
      }, 60000) // Verifica a cada minuto
    }

    // Usa o router e monta a aplicação APÓS a inicialização do Keycloak
    app.use(router)
    app.mount('#app')

  } catch (error) {
    console.error('Falha ao inicializar o Keycloak:', error)
    
    // Tenta fazer login se a inicialização falhar
    if (keycloak.createLoginUrl) {
      console.log('Redirecionando para login...')
      window.location.replace(keycloak.createLoginUrl())
    } else {
      document.body.innerHTML = `
        <div style="text-align: center; padding: 50px; font-family: sans-serif;">
          <h1>Erro de Autenticação</h1>
          <p>Não foi possível conectar ao serviço de autenticação.</p>
          <p>Erro: ${error}</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Tentar Novamente
          </button>
        </div>
      `
    }
  }
}

// Inicia a aplicação
initializeApp()