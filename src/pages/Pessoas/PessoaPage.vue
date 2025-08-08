<template>
  <q-page class="q-ma-md">
    <h5>{{ edit ? 'Edição' : 'Criação' }} de pessoa</h5>
    <q-linear-progress indeterminate v-if="loading" />
    <q-form class="q-gutter-md" ref="form">
      <q-checkbox
        v-model="tipoPessoa"
        true-value="PJ"
        false-value="PF"
        label="Pessoa Jurídica"
      ></q-checkbox>
      <q-input
        outlined
        v-model="object.nome"
        label="Nome"
        placeholder="Ex: José da Silva"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
      />
      <q-input
        outlined
        v-model="object.cpf_cnpj"
        :label="`${tipoPessoa === 'PF' ? 'Digite o CPF' : 'Digite o CNPJ'}`"
        :placeholder="`${tipoPessoa === 'PF' ? 'Ex: 123.456.789-00' : 'Ex: 12.345.678/0001-00'}`"
        :mask="`${tipoPessoa === 'PF' ? '###.###.###-##' : '##.###.###/####-##'}`"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
      />
      <q-input
        outlined
        v-model="object.endereco"
        label="Endereço completo"
        placeholder="Ex: Rua das Flores, 123, Apto 4B, Bairro Centro, São Paulo, SP, 01000-000"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
      />
      <q-input
        outlined
        v-model="object.email"
        label="Email"
        placeholder="Ex: jose.silva@gmail.com"
        type="email"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
      />
      <q-input
        outlined
        v-model="object.nascimento"
        mask="##/##/####"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
        label="Data de Nascimento(Necessário para Assinatura)"
        placeholder="Ex: dd/mm/aaaa"
      />
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="backToIndex" />
        <q-btn label="Salvar Pessoa" color="positive" @click="save" />
      </q-card-actions>
    </q-form>
  </q-page>
</template>

<script>
import pessoasApi from 'src/api/pessoas.api'
export default {
  name: 'PessoaPage',
  data() {
    return {
      object: {
        nome: '',
        email: '',
      },
      edit: false,
      tipoPessoa: 'PF',
      loading: false,
    }
  },
  created() {
    const Id = this.$route.params.id
    if (Id) {
      this.edit = true
      this.object.Id = Id
      this.loading = true
      this.getModeloById()
    }
  },
  methods: {
    backToIndex() {
      this.$router.push({ name: 'pessoas' })
    },
    getModeloById() {
      pessoasApi
        .getById(this.object.Id)
        .then((res) => {
          if (res.data.list.length) {
            this.object = res.data.list[0]
            this.loading = false
          } else {
            this.object = {}
            this.edit = false
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    save() {
      this.$refs.form.validate().then((valid) => {
        if (valid) {
          if (this.edit) {
            this.update()
          } else {
            this.create()
          }
        } else {
          alert('Existem campos não preenchidos')
        }
      })
    },
    create() {
      pessoasApi
        .create(this.object)
        .then(this.backToIndex())
        .catch((error) => {
          console.log(error)
        })
    },
    update() {
      pessoasApi
        .update(this.object)
        .then(this.backToIndex())
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>

<style></style>
