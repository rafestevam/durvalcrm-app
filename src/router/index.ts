// src/router/index.ts
import Home from '../views/Home.vue';
import Associados from '../views/Associados.vue';
import AssociadoForm from '../views/AssociadoForm.vue';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/associados',
    name: 'associados',
    component: Associados,
    meta: { requiresAuth: true }
  },
  {
    path: '/associados/novo',
    name: 'associado-novo',
    component: AssociadoForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/associados/editar/:id',
    name: 'associado-editar',
    component: AssociadoForm,
    props: true,
    meta: { requiresAuth: true }
  }
];