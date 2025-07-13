import { createRouter, createWebHistory } from 'vue-router'
import Associados from '../views/Associados.vue'
import AssociadoForm from '../views/AssociadoForm.vue'

const routes = [
  {
    path: '/associados',
    name: 'Associados',
    component: Associados,
  },
  {
    path: '/associados/novo',
    name: 'NovoAssociado',
    component: AssociadoForm,
  },
  {
    path: '/associados/editar/:id',
    name: 'EditarAssociado',
    component: AssociadoForm,
    props: true,
  },
  {
    path: '/',
    redirect: '/associados'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Garanta que a exportação seja 'default'
export default router