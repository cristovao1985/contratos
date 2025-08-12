<template>
  <q-page class="text-center">
    <div v-if="!contrato?.Id" class="q-ma-md">
      <q-card class="q-ma-md">
        <q-card-section>
          <div class="text-h6 text-primary">Contrato não encontrado</div>
          <div class="text-subtitle2">
            Infelizmente não econtramos o contrato que foi enviado por e-mail.
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-else>
      <div v-if="contrato?.assinatura_contratado">
        <q-card class="q-ma-md">
          <q-card-section>
            <div class="text-h6 text-primary">Este Contrato já foi assinado. Obrigado</div>
            <div class="text-subtitle2">A parte contrada já assinou o contrato anteriormente</div>
          </q-card-section>
        </q-card>
      </div>
      <div v-else>
        <q-card v-if="!assinar" class="q-ma-md">
          <div class="q-mb-md q-pa-sm">
            <h5 class="text-primary">Assinatura de Contrato Digital</h5>
            <strong>Olá {{ contrato.contratado }}!</strong> <br />
            <span
              >Sua assinatura foi solicitada como parte <strong>CONTRATADA</strong> neste contrato
            </span>
            <br />
            <q-card-actions align="right">
              <q-btn flat label="Ver contrato" @click="verContrato = true" color="primary" />
            </q-card-actions>
          </div>
          <q-card-section class="q-gutter-sm">
            <q-form ref="form" @submit="validar">
              <q-checkbox
                v-model="tipoPessoa"
                true-value="PJ"
                false-value="PF"
                label="Assinar como Pessoa Jurídica"
              ></q-checkbox>
              <q-input
                v-model="contratante.documento"
                label="Digite seu documento"
                outlined
                lazy-rules
                :rules="[(val) => val.length > 4 || 'Campo obrigatório']"
                placeholder="CPF ou CNPJ"
                :mask="`${tipoPessoa === 'PF' ? '###.###.###-##' : '##.###.###/####-##'}`"
              />
              <q-input
                v-model="contratante.nascimento"
                label="Digite sua data de nascimento"
                outlined
                placeholder="Ex: dd/mm/aaaa"
                mask="##/##/####"
                lazy-rules
                :rules="[(val) => val.length > 4 || 'Campo obrigatório']"
              />
              <q-card-actions align="right">
                <q-btn label="Validar Informações" color="primary" @click="validar" />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>

        <q-card v-else class="q-ma-md">
          <h5>Assine dentro da área pontilhada</h5>
          <VueSignaturePad
            width="1000px"
            height="200px"
            ref="signaturePad"
            :customStyle="{ border: 'dotted' }"
          />
          <q-card-actions align="right">
            <q-btn label="Refazer Assinatura" @click="desfazerAssinatura" flat />
            <q-btn label="Assinar Contrato" color="positive" @click="assinarContrato" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="verContrato">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Revisão de Contrato</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <span v-html="contrato.conteudo"></span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Fechar" @click="verContrato = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import pessoasApi from 'src/api/pessoas.api'
import { VueSignaturePad } from 'vue-signature-pad'
import contratosApi from 'src/api/contratos.api'
export default {
  name: 'AssinaturaContratantePage',
  components: {
    VueSignaturePad,
  },
  data() {
    return {
      pessoa: {},
      contrato: {
        assinatura_contratado: 'Sim',
      },
      contratante: {
        documento: '',
        nascimento: '',
      },
      tipoPessoa: 'PF',
      assinar: false,
      verContrato: false,
    }
  },
  async created() {
    await this.validarContrato()
    if (this.contrato?.Id) {
      this.getPessoaByEmail()
    }
  },
  methods: {
    getPessoaByEmail() {
      pessoasApi
        .getByEmail(this.contrato.email_contratante)
        .then((res) => {
          this.pessoa = res.data.list[0]
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async validarContrato() {
      await contratosApi
        .validarContratoPorContratadoIdContrato(
          this.$route.params.contratado,
          this.$route.params.contrato,
        )
        .then((res) => {
          this.contrato = res.data.list[0]
        })
        .catch((error) => {
          console.log(error)
        })
    },
    validar() {
      this.$refs.form.validate().then((valid) => {
        if (valid) {
          const date1 = new Date(this.pessoa.nascimento)
          const date2 = this.parseBrDate(this.contratante.nascimento)
          const documentoPessoa = this.parseDocument(this.pessoa.cpf_cnpj)
          const documentoContratante = this.parseDocument(this.contratante.documento)

          if (date1.getTime() === date2.getTime() && documentoPessoa === documentoContratante) {
            alert('Seguir para assinatura')
            this.assinar = true
          } else {
            alert(
              'Dados inválidos. Dados do contratante não conferem. Verifique o documento e data de nascimento informados',
            )
            this.assinar = false
          }
        }
      })
    },
    parseBrDate(dateStr) {
      const [dia, mes, ano] = dateStr.split('/')
      return new Date(`${ano}-${mes}-${dia}`)
    },
    parseDocument(doc) {
      return doc.replace(/\D/g, '')
    },
    desfazerAssinatura() {
      this.$refs.signaturePad.undoSignature()
    },
    assinarContrato() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
      if (isEmpty) {
        alert('Assinatura não realizada')
      } else {
        const contrato = {
          Id: this.$route.params.contrato,
          assinatura_contratado: data,
        }
        contratosApi
          .update(contrato)
          .then(() => {
            alert('Contrato assinado com sucesso!')
            this.assinar = false
            this.validarContrato()
          })
          .catch((error) => {
            console.log(error)
            alert('houve um erro ao assinar contrato')
          })
      }
    },
  },
}
</script>

<style></style>
