<template>
  <q-page class="q-ma-md">
    <q-card class="q-pa-md" style="width: 400px">
      <q-img :src="logo" style="height: 150px; height: 200px" class="q-mb-md">
        <!-- <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-weight-bold">Razvan Stoenescu</div>
            <div>@rstoenescu</div>
          </div> -->
      </q-img>
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6 text-primary">Login do Sistema</div>
          <div class="text-subtitle2">Acessar Plataforma</div>
        </q-card-section>
      </q-card>
      <q-form @submit="loginAccount" class="q-gutter-md">
        <q-input
          outlined
          label="Email"
          placeholder="Digite seu Email"
          type="email"
          v-model="login.email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
        >
          <template v-slot:append>
            <q-icon name="email" class="cursor-pointer" />
          </template>
        </q-input>
        <q-input
          outlined
          label="Senha"
          placeholder="Digite sua Senha"
          v-model="login.password"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn
          label="Acessar Sistema"
          @click="save"
          color="positive"
          type="submit"
          :loading="loading"
        />
        <q-btn flat label="Esqueci minha Senha" />
        <q-btn flat label="Criar conta gratuita" to="/conta" class="full-width" color="primary" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import tenantsApi from '../../api/tenants.api'
import firebaseApi from '../../api/firebase/authentication.api'
export default {
  name: 'LoginPage',
  data() {
    return {
      login: {
        email: '',
        password: '',
      },
      isPwd: true,
      loading: false,
    }
  },
  computed: {
    logo() {
      return require('../../../public/images/banner.png')
    },
  },
  methods: {
    loginAccount() {
      this.loading = true
      firebaseApi
        .login(this.login)
        .then((res) => {
          if (!res.emailVerified) {
            alert(
              'Sua conta ainda não foi verificada. Acesse sua caixa de email e clique no link enviado',
            )
            this.loading = false
            return
          }
          if (res.uid) {
            tenantsApi
              .getByEmail(this.login.email)
              .then((usuario) => {
                if (usuario.data) {
                  var today = new Date()
                  today.setHours(today.getHours() + 10)

                  const user = usuario.data.list[0]

                  localStorage.setItem(
                    'contrato-user',
                    JSON.stringify({
                      email: user.email,
                      nome: user.nome,
                      tenant: user.tenant,
                      expires: new Date(today).getTime(),
                      logo: user.logo,
                      fb_id: res.uid,
                    }),
                  )

                  this.$router.push({ name: 'home' })
                }
              })
              .catch((error) => {
                console.log(error.message)
                this.loading = false
              })
          }
        })
        .catch((error) => {
          console.log(error)
          alert('Houve um erro no login. Verifique seu email e senha e tente novamente.')
          this.loading = false
        })
    },
  },
}
</script>

<style></style>
