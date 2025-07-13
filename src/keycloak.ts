// src/keycloak.ts
import { type InjectionKey } from 'vue'
import Keycloak from 'keycloak-js'

// A InjectionKey garante a tipagem correta ao injetar o Keycloak nos componentes
export const keycloakKey: InjectionKey<Keycloak> = Symbol('keycloak')

// Configuração do Keycloak mais robusta
const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'durval-crm',
  clientId: 'durvalcrm-app'
}

// Verifica se a configuração está correta
console.log('Configuração do Keycloak:', keycloakConfig)

// A instância do Keycloak é criada e exportada a partir de um único local
export const keycloak = new Keycloak(keycloakConfig)

// Adiciona eventos úteis para debug
keycloak.onTokenExpired = () => {
  console.log('Token expirado, tentando renovar...')
  keycloak.updateToken(30).then((refreshed) => {
    if (refreshed) {
      console.log('Token renovado com sucesso')
    } else {
      console.log('Token ainda válido')
    }
  }).catch(() => {
    console.log('Falha ao renovar token, fazendo logout')
    keycloak.logout()
  })
}

keycloak.onAuthSuccess = () => {
  console.log('Autenticação bem-sucedida')
}

keycloak.onAuthError = (error) => {
  console.error('Erro de autenticação:', error)
}

keycloak.onAuthRefreshSuccess = () => {
  console.log('Token atualizado com sucesso')
}

keycloak.onAuthRefreshError = () => {
  console.log('Falha ao atualizar token')
}

keycloak.onAuthLogout = () => {
  console.log('Usuário deslogado')
}