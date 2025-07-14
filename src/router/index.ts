// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Associados from '../views/Associados.vue';
import AssociadoForm from '../views/AssociadoForm.vue';
import { keycloak } from '../keycloak';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/associados', name: 'Associados', component: Associados, meta: { requiresAuth: true } },
  { path: '/associados/novo', name: 'NovoAssociado', component: AssociadoForm, meta: { requiresAuth: true } },
  { path: '/associados/editar/:id', name: 'EditarAssociado', component: AssociadoForm, props: true, meta: { requiresAuth: true } }
  // Adicione uma rota de login/pública se precisar de uma página que não exija autenticação
  // { path: '/login', name: 'Login', component: LoginView, meta: { requiresAuth: false } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guarda de Navegação (Navigation Guard) Robusta
router.beforeEach(async (to, from, next) => {
  // 1. Ignora rotas que não exigem autenticação
  if (!to.meta.requiresAuth) {
    return next();
  }

  // 2. Se o Keycloak está pronto e o usuário está autenticado, permite o acesso
  if (keycloak && keycloak.authenticated) {
    return next();
  }

  // 3. Se o usuário não estiver autenticado, inicia o fluxo de login
  try {
    // As opções de redirecionamento garantem que o usuário volte para a página que tentou acessar.
    await keycloak.login({ redirectUri: window.location.origin + to.fullPath });
  } catch (error) {
    console.error("Falha ao tentar redirecionar para o login:", error);
  }
});

export default router;