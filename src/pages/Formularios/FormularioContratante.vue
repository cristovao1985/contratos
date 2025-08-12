<template>
  <q-page class="q-ma-md">
    <div v-if="!contrato?.Id" class="q-ma-md">
      <q-card class="q-ma-md">
        <q-card-section>
          <div class="text-h6 text-primary">Contrato não encontrado</div>
          <div class="text-subtitle2">
            Infelizmente não econtramos o contrato que foi solicitado prenchimento por e-mail.
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-else>
      <div v-if="contrato.contratante && contrato.assinatura_contratante">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6 text-primary">Preenchimento Contratante</div>
            <div class="text-subtitle2">
              Os dados do Contratante foram informados anteriormente. Obrigado
            </div>
          </q-card-section>
        </q-card>
      </div>
      <q-card v-else>
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6 text-primary">Preenchimento Contratante</div>
            <div class="text-subtitle2">
              Solicitado o preenchimento dos seus dados como parte Contratante
            </div>
          </q-card-section>
        </q-card>
        <div class="row">
          <div class="col-4">
            <q-form class="q-gutter-md q-pa-md" ref="form">
              <q-checkbox
                v-model="tipoPessoa"
                true-value="PJ"
                false-value="PF"
                label="Sou Pessoa Jurídica"
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
                type="date"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
                label="Data de Nascimento(Necessário para Assinatura)"
                placeholder="Ex: dd/mm/aaaa"
              />
              <q-card-actions align="right">
                <q-btn flat label="Limpar" @click="object = {}" />
                <q-btn label="Enviar Informações" color="positive" @click="save" />
              </q-card-actions>
            </q-form>
          </div>
          <div class="col-1"></div>
          <div class="col-7">
            <q-scroll-area style="height: 100vh; max-width: 100%">
              <span v-html="contrato.conteudo"></span>
            </q-scroll-area>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import contratosApi from 'src/api/contratos.api'
export default {
  name: 'FormularioContratantePage',
  data() {
    return {
      object: {
        nome: '',
        email: '',
        endereco: '',
        nascimento: '',
        cpf_cnpj: '',
      },
      edit: false,
      tipoPessoa: 'PF',
      loading: false,
      contrato: {},
    }
  },
  created() {
    this.getContrato()
  },
  methods: {
    getContrato() {
      contratosApi
        .getFormularioById(this.$route.params.contrato)
        .then((res) => {
          this.contrato = res.data.list[0]
        })
        .catch((error) => {
          console.log(error)
        })
    },
    atualizarConteudoComPessoas() {
      let conteudo = this.contrato.conteudo
      console.log('oi')

      conteudo = conteudo
        .replace(/\[contratante\.nome\]/g, this.object.nome)
        .replace(/\[contratante\.cpfCnpj\]/g, this.object.cpf_cnpj)
        .replace(/\[contratante\.endereco\]/g, this.object.endereco)

      //   this.contrato.pessoas.contratante = {
      //     nome: this.object.nome,
      //     email: this.object.email,
      //   }

      this.contrato.contratante = this.object.nome
      this.contrato.email_contratante = this.object.email

      this.contrato.conteudo = conteudo
    },
  },
}
</script>

<style></style>
