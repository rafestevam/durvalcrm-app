import { createApp, type InjectionKey } from 'vue'
import './style.css'
import App from './App.vue'
import Keycloak from 'keycloak-js'

// --- Boas Práticas com TypeScript ---
// É recomendado criar uma InjectionKey para garantir que a injeção de dependência 
// seja totalmente tipada em toda a aplicação.
export const keycloakKey: InjectionKey<Keycloak> = Symbol('keycloak')
// ------------------------------------

//createApp(App).mount('#app')
const app = createApp(App)

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'durval-crm',
  clientId: 'durvalcrm-app'
})

// Função para inicializar a aplicação
const initializeApp = async () => {
  try {
    const authenticated = await keycloak.init({ 
      onLoad: 'login-required' 
    })

    console.log(`Usuário está ${authenticated ? 'autenticado' : 'não autenticado'}.`)

    // Fornece a instância do Keycloak para toda a aplicação usando a InjectionKey
    app.provide(keycloakKey, keycloak)

    app.mount('#app')

  } catch (error) {
    console.error('Falha ao inicializar o Keycloak', error)
  }
}

initializeApp()
