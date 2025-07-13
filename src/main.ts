import { createApp, type InjectionKey } from 'vue'
import App from './App.vue'
import router from './router' // Mantido, assumindo que seu router está configurado
import Keycloak from 'keycloak-js'
import './assets/main.css'

// --- Boas Práticas com TypeScript ---
// É recomendado criar uma InjectionKey para garantir que a injeção de dependência 
// seja totalmente tipada em toda a aplicação.
export const keycloakKey: InjectionKey<Keycloak> = Symbol('keycloak')
// ------------------------------------

// 1. Crie a instância da aplicação Vue ANTES de inicializar o Keycloak.
const app = createApp(App)

// 2. Configure a instância do Keycloak.
// A URL para o realm do Keycloak pode ser encontrada na documentação da API.
export const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'durval-crm',
  clientId: 'durvalcrm-app'
})

// 3. Crie uma função assíncrona para encapsular a inicialização.
const initializeApp = async () => {
  try {
    // Inicializa o Keycloak com a opção 'login-required', 
    // que força a autenticação antes de carregar a app.
    const authenticated = await keycloak.init({ 
      onLoad: 'login-required' 
    })

    console.log(`Usuário está ${authenticated ? 'autenticado' : 'não autenticado'}.`)

    // 4. Disponibilize a instância do Keycloak para toda a aplicação 
    // usando o sistema de 'provide/inject' do Vue.
    // Esta é a forma recomendada no Vue 3.
    app.provide(keycloakKey, keycloak)

    // 5. Use os plugins (como o router) e monte a aplicação.
    app.use(router)
    app.mount('#app')

  } catch (error) {
    console.error('Falha ao inicializar o Keycloak', error)
    // Exibe uma mensagem de erro amigável para o usuário.
    document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: sans-serif;"><h1>Erro de Autenticação</h1><p>Não foi possível conectar ao serviço de autenticação. Por favor, tente novamente mais tarde.</p></div>';
  }
}

// 6. Chame a função de inicialização.
initializeApp()