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

// Guarda de Navegação (Navigation Guard) Simplificada
router.beforeEach((to, from, next) => {
  // Apenas verifica se a rota exige autenticação e se o usuário não está logado.
  // O redirecionamento inicial já foi tratado pelo `keycloak.init`.
  if (to.meta.requiresAuth && !keycloak.authenticated) {
    // Se o Keycloak falhar ao redirecionar, isso impede o acesso à rota.
    // Em um cenário normal, o `keycloak.init` já terá redirecionado o usuário.
    console.error("Acesso negado: o usuário não está autenticado.");
    // Opcional: redirecionar para uma página de "acesso negado" ou simplesmente não fazer nada.
    return;
  }
  
  // Permite a navegação.
  next();
})

export default router;