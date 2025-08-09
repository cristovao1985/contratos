import PrintComponent from '../components/PrintFile.vue'

const routes = [
  { path: '/', redirect: { path: '/home' } },
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '/login', name: 'login', component: () => import('pages/Login/IndexPage.vue') },
      { path: '/conta', name: 'conta', component: () => import('pages/Conta/IndexPage.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', name: 'home', component: () => import('pages/IndexPage.vue') },
      { path: '/modelos', name: 'modelos', component: () => import('pages/Modelos/IndexPage.vue') },
      { path: '/modelo/:id?', component: () => import('pages/Modelos/ModeloPage.vue') },
      { path: '/pessoas', name: 'pessoas', component: () => import('pages/Pessoas/IndexPage.vue') },
      { path: '/pessoa/:id?', component: () => import('pages/Pessoas/PessoaPage.vue') },
      {
        path: '/contratos',
        name: 'contratos',
        component: () => import('pages/Contratos/IndexPage.vue'),
      },
      { path: '/contrato/:id?', component: () => import('pages/Contratos/ContratoPage.vue') },
      { path: '/perfil', name: 'perfil', component: () => import('pages/Perfil/IndexPage.vue') },
      {
        path: '/templates',
        name: 'templates',
        component: () => import('pages/Templates/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/PrintLayout.vue'),
    children: [{ path: '/print/:id', name: 'print', component: () => PrintComponent }],
  },
  {
    path: '/',
    component: () => import('layouts/AssinaturaLayout.vue'),
    children: [
      {
        path: '/assinatura-contratante/:contratante/:contrato',
        name: 'assinatura-contratante',
        component: () => import('pages/Assinaturas/AssinarContratante.vue'),
      },
      {
        path: '/assinatura-contratado/:contratado/:contrato',
        name: 'assinatura-contratado',
        component: () => import('pages/Assinaturas/AssinarContratado.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
