<template>
  <q-page class="q-ma-md">
    <q-card class="q-pa-md" style="width: 400px">
      <q-img :src="logo" style="height: 150px; height: 180px" class="q-mb-md">
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
          <div class="text-h6 text-primary">Criar conta Gratuita</div>
          <div class="text-subtitle2">Você terá acesso gratuito por 7 dias</div>
        </q-card-section>
      </q-card>

      <q-form ref="form" class="q-gutter-md">
        <q-checkbox
          v-model="tipoPessoa"
          true-value="PJ"
          false-value="PF"
          label="Criar conta como Pessoa Jurídica"
        ></q-checkbox>
        <q-input
          v-model="object.nome"
          label="Nome"
          placeholder="Digite seu nome ou nome da empresa"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
          outlined
        />
        <q-input
          v-model="object.cpf_cnpj"
          label="Digite seu documento"
          outlined
          lazy-rules
          :rules="[(val) => val.length > 0 || 'Campo obrigatório']"
          placeholder="CPF ou CNPJ"
          :mask="`${tipoPessoa === 'PF' ? '###.###.###-##' : '##.###.###/####-##'}`"
        />
        <q-input
          v-model="object.email"
          label="Email"
          placeholder="Digite seu melhor email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
          outlined
          type="email"
        />
        <q-input
          outlined
          label="Senha"
          placeholder="Digite sua Senha"
          v-model="object.senha"
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
      </q-form>
      <q-btn
        label="Criar Conta Gratuita"
        @click="validarConta"
        color="positive"
        :loading="loading"
      />
      <q-btn flat label="Já tenho conta" to="/login" />
    </q-card>
  </q-page>
</template>

<script>
import tenantsApi from 'src/api/tenants.api'
import authenticationApi from 'src/api/firebase/authentication.api'
import webhookApi from 'src/api/webhook.api'
export default {
  name: 'IndexPage',
  data() {
    return {
      object: {
        nome: 'Rota Central Saúde',
        cpf_cnpj: '222.222.222-22',
        email: 'annasouza1236@gmail.com',
        senha: 'voce1234',
      },
      tipoPessoa: 'PF',
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
    async validarConta() {
      await this.$refs.form.validate().then((isValid) => {
        if (isValid) {
          this.loading = true
          tenantsApi
            .getByEmail(this.object.email)
            .then((res) => {
              if (res.data.list?.length) {
                alert('Já existe uma conta para este email')
              } else {
                this.criarContaFirebase()
              }
            })
            .catch((error) => {
              console.log(error)
              this.loading = false
            })
        }
      })
    },
    criarContaFirebase() {
      authenticationApi
        .createAccont(this.object.email, this.object.senha)
        .then((res) => {
          this.object.fb_id = res.uid
          this.criarContaNoco()
        })
        .catch((error) => {
          alert('Houve um error ao criar sua conta')
          console.log(error)
          this.loading = false
        })
    },
    criarContaNoco() {
      const hoje = new Date()
      const daqui7dias = new Date(hoje)
      daqui7dias.setDate(hoje.getDate() + 7)

      this.object.validade = daqui7dias.toISOString().split('T')[0]
      tenantsApi
        .create(this.object)
        .then(() => {
          this.emailBoasVindas()
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    backToLogin() {
      this.$router.push({ name: 'login' })
    },
    emailBoasVindas() {
      const data = {
        nome: this.object.nome,
        email: this.object.email,
      }
      webhookApi
        .emailBoasVindas(data)
        .then(() => {
          alert('Conta criada! Verifique seu e-mail antes de fazer login.')
          this.loading = false
          this.backToLogin()
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>

<style></style>
