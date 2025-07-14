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

// ✅ GUARDA DE ROTA FINAL E ESTÁVEL
router.beforeEach((to, from, next) => {
  // Se a rota não requer autenticação, permita o acesso.
  if (!to.meta.requiresAuth) {
    return next();
  }

  // Se a rota requer autenticação e o usuário está logado, permita o acesso.
  if (keycloak.authenticated) {
    return next();
  }
  
  // Se a rota requer autenticação e o usuário NÃO está logado, inicie o processo de login.
  console.log('Usuário não autenticado, redirecionando para o login...');
  
  // A URL de redirecionamento é a rota que o usuário tentou acessar.
  const loginOptions = {
    redirectUri: window.location.origin + to.fullPath
  };
  
  keycloak.login(loginOptions);
});

export default router;