// src/keycloak.ts
import { type InjectionKey } from 'vue'
import Keycloak from 'keycloak-js'

// A InjectionKey garante a tipagem correta ao injetar o Keycloak nos componentes.
export const keycloakKey: InjectionKey<Keycloak> = Symbol('keycloak')

// A instância do Keycloak é criada e exportada a partir de um único local.
export const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'durval-crm',
  clientId: 'durvalcrm-app'
})