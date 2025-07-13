// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Associados from '../views/Associados.vue'
import AssociadoForm from '../views/AssociadoForm.vue'
import { keycloak } from '../keycloak' // Importando do novo arquivo

const routes = [
  // Todas as rotas agora possuem um metadado 'requiresAuth' para a guarda de navegação.
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/associados', name: 'Associados', component: Associados, meta: { requiresAuth: true } },
  { path: '/associados/novo', name: 'NovoAssociado', component: AssociadoForm, meta: { requiresAuth: true } },
  { path: '/associados/editar/:id', name: 'EditarAssociado', component: AssociadoForm, props: true, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guarda de Navegação (Navigation Guard)
router.beforeEach((to, from, next) => {
  // Se a rota exige autenticação e o usuário não está logado
  if (to.meta.requiresAuth && !keycloak.authenticated) {
    // Redireciona para a página de login do Keycloak.
    const loginUrl = keycloak.createLoginUrl({
      // Após o login, o usuário será redirecionado de volta para a rota que tentou acessar.
      redirectUri: window.location.origin + to.fullPath
    })
    window.location.replace(loginUrl)
  } else {
    // Se o usuário estiver logado ou a rota não exigir autenticação, permite a navegação.
    next()
  }
})

export default router