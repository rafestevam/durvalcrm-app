// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Associados from '../views/Associados.vue';
import AssociadoForm from '../views/AssociadoForm.vue';
import keycloak from '../keycloak';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/associados', name: 'Associados', component: Associados, meta: { requiresAuth: true } },
  { path: '/associados/novo', name: 'NovoAssociado', component: AssociadoForm, meta: { requiresAuth: true } },
  { path: '/associados/editar/:id', name: 'EditarAssociado', component: AssociadoForm, props: true, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guarda de Navegação (Navigation Guard) Robusta
router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next();
  }

  if (keycloak && keycloak.authenticated) {
    return next();
  }

  try {
    await keycloak.login({ redirectUri: window.location.origin + to.fullPath });
  } catch (error) {
    console.error("Falha ao tentar redirecionar para o login:", error);
  }
});

export default router;