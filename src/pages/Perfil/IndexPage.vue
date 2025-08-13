<template>
  <q-page class="q-ma-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary">Meu Perfil</div>
        <div class="text-subtitle2">Informações da minha conta</div>
        <strong class="text-primary">Validade da conta: </strong>Sua conta é válida até
        {{ formatDate(object.validade) }}
        <q-icon name="help" size="18px">
          <q-tooltip class="bg-primary">
            <span class="text-h6">
              Após {{ formatDate(object.validade) }} algumas funcionalidades serão bloqueadas, mas
              você poderá acessar o sistema normalmente
            </span>
          </q-tooltip>
        </q-icon>
        <br />
      </q-card-section>
      <q-linear-progress indeterminate v-if="loading" />
    </q-card>
    <q-form ref="form" class="q-gutter-sm">
      <q-checkbox
        v-model="object.tipo_pessoa"
        true-value="PJ"
        false-value="PF"
        label="Sou Pessoa Jurídica"
      ></q-checkbox>
      <q-input
        outlined
        v-model="object.nome"
        label="Nome"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
      />
      <q-input
        v-model="object.cpf_cnpj"
        label="Digite seu documento"
        outlined
        lazy-rules
        :rules="[(val) => val.length > 4 || 'Campo obrigatório']"
        placeholder="CPF ou CNPJ"
        :mask="`${object.tipo_pessoa === 'PF' ? '###.###.###-##' : '##.###.###/####-##'}`"
      />
      <q-input outlined v-model="object.telefone" label="Telefone" mask="(##)#####-####" />
      <q-input outlined v-model="object.email" disable label="Email" />
      <q-input outlined v-model="object.endereco" label="Endereço Completo" />
      <q-file outlined v-model="file" label="Toque para selecionar imagem" color="positive">
        <template v-slot:prepend>
          <q-icon name="add_photo_alternate" />
        </template>
      </q-file>
      <br />
      <div>
        <q-avatar size="80px">
          <img :src="object.logo" />
        </q-avatar>
        <q-btn icon="delete" flat color="negative" @click="object.logo = ''" v-if="object.logo" />
      </div>
    </q-form>
    <q-card-actions align="right">
      <q-btn label="Salvar Perfil" color="positive" @click="save" :loading="loading" />
    </q-card-actions>
  </q-page>
</template>
<script>
import tenantsApi from '../../api/tenants.api'
import helpers from '../../helpers/base64'
import dateHelper from '../../helpers/dateHelper'
import showMessage from '../../boot/notify'
export default {
  name: 'PerfilPage',
  data() {
    return {
      object: {},
      file: '',
      loading: false,
      tipoPessoa: 'PF',
    }
  },
  created() {
    this.getPerfil()
  },
  watch: {
    file() {
      this.setBase64(this.file)
    },
  },
  methods: {
    getPerfil() {
      this.loading = true
      const nutri = JSON.parse(localStorage.getItem('contrato-user'))
      tenantsApi
        .getByEmail(nutri.email)
        .then((res) => {
          this.object = res.data.list[0]
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async setBase64(file = this.file) {
      await helpers.getBase64(file).then((data) => {
        this.object.logo = data
        this.object.image = data
      })
    },
    async save() {
      this.loading = true
      await this.$refs.form
        .validate()
        .then(async (valid) => {
          delete this.object.CreatedAt
          delete this.object.UpdatedAt
          if (!this.file) {
            delete this.object.logo
          }
          if (valid) {
            await tenantsApi
              .update(this.object, this.$route.params.id)
              .then(() => {
                showMessage.success('Perfil alterado com sucesso!')
                this.loading = false
              })
              .catch((error) => {
                console.log(error)
              })
          }
        })
        .catch((invalid) => {
          console.log(invalid)
        })
    },
    formatDate(date) {
      return dateHelper.brazilFormat(date)
    },
  },
}
</script>
