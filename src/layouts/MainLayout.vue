<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Gestão de Contratos</q-toolbar-title>

        <div>v.0.0.2</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-img :src="logo" style="height: 150px"> </q-img>
        <q-item clickable @click="changePerfil">
          <q-item-section avatar>
            <q-avatar>
              <img :src="user.logo" />
            </q-avatar>
          </q-item-section>
          <q-item-section>{{ user.nome }}</q-item-section>
        </q-item>
        <div v-if="!hasAccess" class="q-ma-md">
          <span class="text-negative">
            Sua conta expirou! Algumas funcionalidades foram bloqueadas
          </span>
        </div>
        <q-separator />
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
      <q-separator />

      <div class="q-ma-md">
        <q-btn
          label="Sair do Sistema"
          color="negative"
          class="full-width"
          @click="loggout"
          icon="logout"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import firebaseApi from '../api/firebase/authentication.api'
import { useCounterStore } from '../stores/example-store'
import session from 'src/helpers/session'
const linksList = [
  {
    title: 'Home',
    caption: 'Tela Inicial',
    icon: 'home',
    link: '#/home',
  },
  {
    title: 'Modelos',
    caption: 'Modelos de Contratos',
    icon: 'description',
    link: '#/modelos',
  },
  {
    title: 'Templates',
    caption: 'Modelos prontos',
    icon: 'content_copy',
    link: '#/templates',
  },
  {
    title: 'Pessoas',
    caption: 'Participantes em Contrato',
    icon: 'group',
    link: '#/pessoas',
  },
  {
    title: 'Contratos',
    caption: 'Gerenciamento de Contratos',
    icon: 'edit_document',
    link: '#/contratos',
  },
  {
    title: 'Configurações',
    caption: 'Meu Perfil',
    icon: 'settings',
    link: '#/perfil',
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const logo = require('../../public/images/banner.png')
    const user = JSON.parse(localStorage.getItem('contrato-user'))
    const store = useCounterStore()
    return {
      linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logo,
      user,
      store,
    }
  },
  mounted() {
    this.verifySession()
  },
  computed: {
    hasAccess() {
      return this.store.hasAccess
    },
  },
  methods: {
    loggout() {
      firebaseApi.loggout()
      this.$router.push({ name: 'login' })
      localStorage.removeItem('contrato-user')
    },
    changePerfil() {
      this.$router.push({ name: 'perfil' })
    },
    async verifySession() {
      await session.hasAccess()
    },
  },
})
</script>
