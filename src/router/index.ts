// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Associados from '../views/Associados.vue'
import AssociadoForm from '../views/AssociadoForm.vue'
import { keycloak } from '../keycloak'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/associados', name: 'Associados', component: Associados, meta: { requiresAuth: true } },
  { path: '/associados/novo', name: 'NovoAssociado', component: AssociadoForm, meta: { requiresAuth: true } },
  { path: '/associados/editar/:id', name: 'EditarAssociado', component: AssociadoForm, props: true, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guarda de Navegação melhorada
router.beforeEach(async (to, from, next) => {
  console.log(`Navegando para: ${to.path}`)
  
  // Se a rota não exige autenticação, permite a navegação
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  // Verifica se o Keycloak foi inicializado
  if (!keycloak) {
    console.log('Keycloak não inicializado, redirecionando...')
    next(false)
    return
  }

  // Se o usuário está autenticado, permite a navegação
  if (keycloak.authenticated) {
    console.log('Usuário autenticado, permitindo navegação')
    
    // Verifica se o token está válido e atualiza se necessário
    try {
      await keycloak.updateToken(30)
      next()
    } catch (error) {
      console.log('Token inválido, fazendo logout')
      keycloak.logout()
    }
    return
  }

  // Se chegou até aqui, o usuário não está autenticado
  console.log('Usuário não autenticado, redirecionando para login')
  
  // Salva a rota atual para redirecionamento após login
  sessionStorage.setItem('redirectPath', to.fullPath)
  
  // Redireciona para login do Keycloak
  try {
    const loginUrl = keycloak.createLoginUrl({
      redirectUri: `${window.location.origin}${to.fullPath}`
    })
    window.location.replace(loginUrl)
  } catch (error) {
    console.error('Erro ao criar URL de login:', error)
    // Fallback: redireciona para a página de login padrão
    window.location.replace(`${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/auth?client_id=${keycloak.clientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code`)
  }
})

// Intercepta o retorno do login
router.afterEach((to) => {
  // Se há um path salvo para redirecionamento e estamos na home
  if (to.path === '/' && keycloak.authenticated) {
    const savedPath = sessionStorage.getItem('redirectPath')
    if (savedPath && savedPath !== '/') {
      sessionStorage.removeItem('redirectPath')
      router.replace(savedPath)
    }
  }
})

export default router