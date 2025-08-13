<template>
  <q-page class="q-ma-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary">{{ edit ? 'Edição' : 'Criação' }} de contrato</div>
        <div class="text-subtitle2">Crie ou edite um contrato entre você ou outros signatários</div>
      </q-card-section>
      <q-linear-progress indeterminate v-if="loading" />
    </q-card>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="contrato" label="Dados do Contrato" />
      <q-tab name="anexos" label="Arquivos em Anexo" v-if="edit" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="contrato">
        <div class="row">
          <div class="col-4">
            <q-form class="q-gutter-md" ref="form">
              <q-select
                :options="modelos"
                label="Selecione o Modelo de Contrato"
                outlined
                lazy-rules
                :rules="[(val) => val || 'Campo obrigatório']"
                option-value="Id"
                option-label="nome"
                emit-value
                map-options
                v-model="object.id_modelo"
                :loading="loading"
                color="primary"
              />
              <div v-if="object.id_modelo">
                <q-select
                  :options="pessoas"
                  label="Selecione o Contratante"
                  outlined
                  lazy-rules
                  :rules="[(val) => val || 'Campo obrigatório']"
                  option-value="Id"
                  option-label="nome"
                  emit-value
                  map-options
                  v-model="object.id_contratante"
                  :loading="loading"
                  color="positive"
                />
                <q-checkbox
                  label="SOU A PARTE CONTRADA"
                  :true-value="1"
                  :false-value="0"
                  v-model="souContratado"
                  class="text-bold"
                />
                <q-select
                  :options="pessoas"
                  label="Selecione o Contratado"
                  outlined
                  lazy-rules
                  :rules="[(val) => (val && !souContratado) || 'Campo obrigatório']"
                  option-value="Id"
                  option-label="nome"
                  emit-value
                  map-options
                  v-model="object.id_contratado"
                  :loading="loading"
                  color="warning"
                  v-if="!souContratado"
                />
                <q-input
                  outlined
                  v-model="object.nome"
                  placeholder="Idetificação do Contrato"
                  label="Idetificação do Contrato"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
                />
                <q-input
                  type="date"
                  v-model="object.validade"
                  outlined
                  label="Validade do Contrato"
                  class="q-mb-sm"
                />
                <q-input
                  v-model="object.observacoes"
                  outlined
                  label="Observações"
                  type="textarea"
                />

                <q-banner class="bg-primary text-white q-mt-sm" rounded>
                  {{
                    solicitarAssinatura
                      ? `As partes envolvidas receberão um email solicitando assinatura deste contrato 100%
                  digital. Fique atento quanto ao vencimento do contrato, caso exista.`
                      : `Você deverá enviar manualmente a solicitação de assinatura na tela de contratos.`
                  }}
                  <template v-slot:action>
                    <q-checkbox
                      label="Solicitar assinatura dos participantes"
                      v-model="solicitarAssinatura"
                      color="positive"
                    />
                  </template>
                </q-banner>
              </div>
            </q-form>
            <q-card-actions align="right" v-if="object.id_modelo">
              <q-btn flat label="Cancelar" @click="backToIndex" />
              <q-btn label="Salvar Contrato" @click="save" color="positive" :loading="loading" />
            </q-card-actions>
          </div>
          <div class="col"></div>
          <div class="col-7">
            <q-editor
              v-model="object.conteudo"
              class="q-pa-sm"
              :toolbar="[
                [
                  {
                    label: 'Alinhamento',
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify'],
                  },
                ],
                ['bold', 'italic', 'strike', 'underline'],
                ['print', 'fullscreen'],
                [
                  {
                    label: 'Tamanho da Fonte',
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
                  },
                  {
                    label: 'Fonte Padrão',
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'default_font',
                      'arial',
                      'arial_black',
                      'comic_sans',
                      'courier_new',
                      'impact',
                      'lucida_grande',
                      'times_new_roman',
                      'verdana',
                    ],
                  },
                  'removeFormat',
                ],
                ['quote', 'unordered', 'ordered'],
                ['undo', 'redo'],
              ]"
              :fonts="{
                arial: 'Arial',
                arial_black: 'Arial Black',
                comic_sans: 'Comic Sans MS',
                courier_new: 'Courier New',
                impact: 'Impact',
                lucida_grande: 'Lucida Grande',
                times_new_roman: 'Times New Roman',
                verdana: 'Verdana',
              }"
            />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="anexos">
        <div class="q-gutter-sm">
          <q-file
            placeholder="Selecione o arquivo para ser anexado ao contrato"
            label="Selecione o arquivo para ser anexado ao contrato"
            outlined
            v-model="file"
            color="positive"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-slot:after>
              <q-btn
                icon="visibility"
                flat
                round
                @click="openModal('anexo', parsedFile)"
                v-if="parsedFile"
              />
              <q-icon
                name="delete"
                color="negative"
                style="cursor: pointer"
                @click="removeParsedFile"
                v-if="parsedFile"
              />
            </template>
          </q-file>
          <q-input
            v-model="anexo.nome"
            outlined
            required
            label="Nome do Anexo"
            placeholder="Digite algo para identificar o anexo"
          />
          <q-card-actions align="right">
            <q-btn
              color="positive"
              label="Anexar arquivo"
              v-if="parsedFile"
              @click="anexarArquivo"
            />
          </q-card-actions>
        </div>

        <q-table :rows="anexos" :columns="columns" :loading="loading" color="primary">
          <template v-slot:body-cell-data="props">
            <q-td :props="props">
              {{ formatDate(props.row.CreatedAt) }}
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn icon="visibility" flat round @click="openModal('anexo', props.row.arquivo)" />
              <q-btn color="negative" icon="delete" flat round @click="deleteAnexo(props.row.Id)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="showModal.anexo">
      <q-card style="width: 90vw; max-width: 1000px; height: 90vh">
        <q-card-section>
          <iframe
            :src="iframeContent"
            frameborder="0"
            width="100%"
            height="800px"
            style="border: none"
          ></iframe>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import contratosApi from 'src/api/contratos.api'
import pessoasApi from 'src/api/pessoas.api'
import modelosApi from 'src/api/modelos.api'
import fileHelper from '../../helpers/base64'
import anexosApi from '../../api/anexos.api'
import wehbookApi from '../../api/webhook.api'
import dateHelper from 'src/helpers/dateHelper'
import showMessage from '../../boot/notify'
export default {
  name: 'ContratoPage',
  data() {
    return {
      object: {
        nome: '',
        email: '',
        modelo: '',
        conteudo: '',
        categoria: '',
        pessoas: {
          contratante: {
            nome: '',
            email: '',
          },
          contratado: {
            nome: '',
            email: '',
          },
        },
        validade: '',
        id_modelo: '',
        id_contratado: '',
        id_contratante: '',
        contrato: '',
        contratante: '',
        email_contratante: '',

        email_contratado: '',
      },
      edit: false,
      tipoPessoa: 'PF',
      pessoas: [],
      modelos: [],
      modelo: '',
      conteudoModelo: '',
      contratante: '',
      file: '',
      parsedFile: '',
      tab: 'contrato',
      anexos: [],
      columns: [
        { field: 'nome', label: 'Nome', align: 'left' },
        { field: 'CreatedAt', name: 'data', label: 'Data Upload', align: 'left' },
        { label: 'Ações', name: 'actions', align: 'left' },
      ],
      anexo: {
        nome: '',
        arquivo: '',
        tenant: 'abc123456',
        id_contrato: '',
      },
      iframeContent: '',
      showModal: {
        anexo: false,
      },
      solicitarAssinatura: true,
      loading: true,
      loadingAnexos: true,
      souContratado: 0,
      contratado: JSON.parse(localStorage.getItem('contrato-user')),
    }
  },
  async created() {
    const Id = this.$route.params.id

    this.getModelos()
    this.getPessoas()
    if (Id) {
      this.edit = true
      this.object.Id = Id
      await this.getContratoById()
      this.getModelos()
    } else {
      this.object.hash = Date.now()
    }
  },
  watch: {
    'object.id_modelo'() {
      this.getConteudoModelo()
    },
    'object.id_contratante'() {
      this.atualizarConteudoComPessoas()
    },
    'object.id_contratado'() {
      this.atualizarConteudoComPessoas()
    },
    file() {
      if (this.file) {
        this.parseFiletoBase64()
      }
    },
    tab() {
      if (this.tab === 'anexos') {
        this.getAnexosContrato()
      }
    },
    souContratado() {
      if (this.souContratado) {
        this.setContratado()
      } else {
        this.atualizarConteudoComPessoas()
      }
    },
  },
  methods: {
    backToIndex() {
      this.$router.push({ name: 'contratos' })
    },
    async getContratoById() {
      await contratosApi
        .getById(this.object.Id)
        .then((res) => {
          if (res.data.list.length) {
            this.object = res.data.list[0]
            this.object.pessoas = JSON.parse(this.object.pessoas)

            if (this.object.id_contratado === this.contratado.id) {
              this.souContratado = 1
            } else {
              this.object.id_contratado = null
            }
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
          if (this.parsedFile) {
            this.object.contrato = this.parsedFile
          }

          this.object.contratante = this.object.pessoas.contratante.nome
          this.object.email_contratante = this.object.pessoas.contratante.email
          this.object.contratado = this.object.pessoas.contratado.nome
          this.object.email_contratado = this.object.pessoas.contratado.email

          this.loading = true
          if (this.edit) {
            this.update()
          } else {
            this.create()
          }
        }
      })
    },
    async create() {
      await contratosApi
        .create(this.object)
        .then(async (res) => {
          if (this.solicitarAssinatura) {
            const webhookContent = {
              contratante: this.object.pessoas.contratante.nome,
              email_contratante: this.object.pessoas.contratante.email,
              contratado: this.object.pessoas.contratado.nome,
              email_contratado: this.object.pessoas.contratado.email,
              id_contrato: res.data.Id,
              nome_contrato: this.object.nome,
            }
            await wehbookApi
              .solicitarAssinaturas(webhookContent)
              .then(() => {
                showMessage.success('Contrato criado com sucesso')
                this.backToIndex()
              })
              .catch((error) => {
                showMessage.error(error.message)
                this.loading = false
              })
          } else {
            this.backToIndex()
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    update() {
      contratosApi
        .update(this.object)
        .then(() => {
          showMessage.success('Contrato editado com sucesso')
          this.backToIndex()
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    getPessoas() {
      pessoasApi
        .getAll()
        .then((res) => {
          this.pessoas = res.data.list
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getModelos() {
      modelosApi
        .getAll()
        .then((res) => {
          this.modelos = []

          res.data.list.forEach((modelo) => {
            this.modelos.push({
              nome: `${modelo.nome}`,
              Id: modelo.Id,
              conteudo: modelo.conteudo,
            })
          })
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getConteudoModelo() {
      this.modelos.forEach((modelo) => {
        if (modelo.Id === this.object.id_modelo) {
          this.object.conteudo = modelo.conteudo
          this.conteudoModelo = modelo.conteudo
          this.nomeModelo = modelo.nome
        }
      })
    },
    atualizarConteudoComPessoas() {
      let conteudo = this.conteudoModelo || this.object.conteudo

      const contratanteObj = this.pessoas.find((p) => p.Id === this.object.id_contratante)

      if (contratanteObj) {
        conteudo = conteudo
          .replace(/\[contratante\.nome\]/g, contratanteObj.nome)
          .replace(/\[contratante\.cpfCnpj\]/g, contratanteObj.cpf_cnpj)
          .replace(/\[contratante\.endereco\]/g, contratanteObj.endereco)

        // Substituir a marcação da assinatura, se houver base64 disponível
        if (this.object.assinatura_contratante) {
          const imgTag = `<img src="${this.object.assinatura_contratante}" style="height: 100px;" />`
          conteudo = conteudo.replace(/\[contratante\.assinatura\]/g, imgTag)
        }

        this.object.pessoas.contratante = {
          nome: contratanteObj.nome,
          email: contratanteObj.email,
        }

        this.object.contratante = contratanteObj.nome
        this.object.email_contratante = contratanteObj.email
      }

      if (!this.souContratado && this.object.id_contratado) {
        const contratadoObj = this.pessoas.find((p) => p.Id === this.object.id_contratado)
        if (contratadoObj) {
          conteudo = conteudo
            .replace(/\[contratado\.nome\]/g, contratadoObj.nome)
            .replace(/\[contratado\.cpfCnpj\]/g, contratadoObj.cpf_cnpj)
            .replace(/\[contratado\.endereco\]/g, contratadoObj.endereco)

          if (this.object.assinatura_contratado) {
            const imgTag = `<img src="${this.object.assinatura_contratado}" style="height: 100px;" />`
            conteudo = conteudo.replace(/\[contratado\.assinatura\]/g, imgTag)
          }

          this.object.pessoas.contratado = {
            nome: contratadoObj.nome,
            email: contratadoObj.email,
          }

          this.object.contratado = contratadoObj.nome
          this.object.email_contratado = contratadoObj.email
        }
      } else if (this.souContratado) {
        this.setContratado()
      }

      this.object.conteudo = conteudo
    },
    async parseFiletoBase64() {
      this.anexo.nome = this.file.name
      await fileHelper.getBase64(this.file).then((data) => {
        this.parsedFile = data
      })
    },
    removeParsedFile() {
      this.file = ''
      this.parsedFile = ''
      this.anexo.nome = ''
    },
    async anexarArquivo() {
      if (!this.anexo.nome) {
        showMessage.warning('Nome do anexo é obrigatório')
        return
      }
      this.loading = true
      this.anexo.arquivo = this.parsedFile
      this.anexo.id_contrato = this.object.Id
      await anexosApi
        .create(this.anexo)
        .then(() => {
          showMessage.success('Arquivo anexado ao contrato com sucesso')
          this.getAnexosContrato()
          this.removeParsedFile()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getAnexosContrato() {
      await anexosApi
        .getAllByIdContrato(this.object.Id)
        .then((res) => {
          this.anexos = res.data.list
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    openModal(modal, content) {
      if (modal === 'anexo') {
        this.iframeContent = content
      }
      this.showModal[modal] = true
    },
    closeModal(modal) {
      this.showModal[modal] = false
    },
    async deleteAnexo(Id) {
      this.loading = true
      await anexosApi
        .delete(Id)
        .then(() => {
          showMessage.success('Arquivo removido com sucesso')
          this.getAnexosContrato()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    formatDate(date) {
      return dateHelper.brazilFormat(date)
    },
    setContratado() {
      let conteudo = this.object.conteudo

      conteudo = conteudo
        .replace(/\[contratado\.nome\]/g, this.contratado.nome)
        .replace(/\[contratado\.cpfCnpj\]/g, this.contratado.cpfCnpj)
        .replace(/\[contratado\.endereco\]/g, this.contratado.endereco)

      if (this.object.assinatura_contratado) {
        const imgTag = `<img src="${this.object.assinatura_contratado}" style="height: 100px;" />`
        conteudo = conteudo.replace(/\[contratado\.assinatura\]/g, imgTag)
      }

      this.object.pessoas.contratado = {
        nome: this.contratado.nome,
        email: this.contratado.email,
      }

      this.object.contratado = this.contratado.nome
      this.object.email_contratado = this.contratado.email
      this.object.id_contratado = this.contratado.id

      this.object.conteudo = conteudo
    },
  },
}
</script>

<style></style>
