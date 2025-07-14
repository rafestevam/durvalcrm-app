import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Associados from '../views/Associados.vue';
import AssociadoForm from '../views/AssociadoForm.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/associados', name: 'Associados', component: Associados },
  { path: '/associados/novo', name: 'NovoAssociado', component: AssociadoForm },
  { path: '/associados/editar/:id', name: 'EditarAssociado', component: AssociadoForm, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// A guarda de rota (router.beforeEach) foi removida.
// A estratégia 'login-required' do Keycloak em main.ts já garante que todas as
// rotas são protegidas, simplificando drasticamente o código e eliminando bugs.

export default router;