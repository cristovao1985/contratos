<template>
  <q-page class="q-ma-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary">{{ edit ? 'Edição' : 'Criação' }} de pessoa</div>
        <div class="text-subtitle2">Pessoa signatária para ser atrelada a um contrato</div>
      </q-card-section>
      <q-linear-progress indeterminate v-if="loading" />
    </q-card>
    <q-form class="q-gutter-md" ref="form">
      <q-checkbox
        v-model="object.tipo_pessoa"
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
        :label="`${object.tipo_pessoa === 'PF' ? 'Digite o CPF' : 'Digite o CNPJ'}`"
        :placeholder="`${object.tipo_pessoa === 'PF' ? 'Ex: 123.456.789-00' : 'Ex: 12.345.678/0001-00'}`"
        :mask="`${object.tipo_pessoa === 'PF' ? '###.###.###-##' : '##.###.###/####-##'}`"
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
        type="date"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
        :label="`${object.tipo_pessoa === 'PF' ? 'Data de Nascimento(Necessário para Assinatura)' : 'Abertura da Empresa(Necessário para Assinatura)'}`"
        placeholder="Ex: dd/mm/aaaa"
      />
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="backToIndex" />
        <q-btn label="Salvar Pessoa" color="positive" @click="save" :loading="loading" />
      </q-card-actions>
    </q-form>
  </q-page>
</template>

<script>
import pessoasApi from 'src/api/pessoas.api'
import showMessage from '../../boot/notify'
export default {
  name: 'PessoaPage',
  data() {
    return {
      object: {
        nome: '',
        email: '',
        tipo_pessoa: 'PF',
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
      this.getPessoa()
    }
  },
  methods: {
    backToIndex() {
      this.$router.push({ name: 'pessoas' })
    },
    getPessoa() {
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
          this.loading = true
          if (this.edit) {
            this.update()
          } else {
            this.create()
          }
        }
      })
    },
    create() {
      pessoasApi
        .create(this.object)
        .then(() => {
          showMessage.success(`${this.object.nome} criado(a) com sucesso`)
          this.backToIndex()
        })
        .catch((error) => {
          showMessage.error('Houve um erro ao criar pessoa')
          console.log(error)
          this.loading = false
        })
    },
    update() {
      pessoasApi
        .update(this.object)
        .then(() => {
          showMessage.success(`${this.object.nome} editado(a) com sucesso`)
          this.backToIndex()
        })
        .catch((error) => {
          showMessage.error('Houve um erro ao editar pessoa')
          console.log(error)
          this.loading = false
        })
    },
  },
}
</script>

<style></style>
