import { type InjectionKey } from 'vue'
import Keycloak from 'keycloak-js'

// A InjectionKey garante a tipagem correta ao injetar o Keycloak nos componentes
export const keycloakKey: InjectionKey<Keycloak> = Symbol('keycloak')

// Configuração final do Keycloak
const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'durval-crm',
  clientId: 'durvalcrm-app'
}

// A instância do Keycloak é criada e exportada a partir de um único local
export const keycloak = new Keycloak(keycloakConfig)