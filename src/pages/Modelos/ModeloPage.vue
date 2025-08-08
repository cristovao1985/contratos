<template>
  <q-page class="q-ma-md">
    <h5>{{ edit ? 'Edição' : 'Criação' }} de modelo de contrato</h5>
    <q-linear-progress indeterminate v-if="loading" />
    <q-form class="q-gutter-md" ref="form">
      <q-input
        outlined
        v-model="object.nome"
        placeholder="Nome do modelo"
        lazy-rules
        :rules="[(val) => (val && val.length > 4) || 'Campo obrigatório']"
      />
      <q-input outlined v-model="object.descricao" placeholder="Descrição do modelo" />
      <br />

      <div class="row">
        <span class="text-h6">Marcações disponíveis:</span>
        <div v-for="marcao in marcacoes" :key="marcao" class="row">
          <div class="row" @click="copyText(marcao)">
            <q-chip color="grey-3" icon-right="content_copy" style="cursor: pointer" dense
              >{{ marcao }}
            </q-chip>
          </div>
        </div>
      </div>

      <q-editor
        v-model="object.conteudo"
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
      <span
        ><strong>Marcações disponíveis:</strong> [ contratante.nome ], [ contratante.cpfCnpj ], [
        contratante.endereco ], [ contratado.nome ], [ contratado.cpfCnpj ], [ contratado.endereco
        ]</span
      >
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="backToIndex" />
        <q-btn label="Salvar Modelo" color="positive" @click="save" />
      </q-card-actions>
    </q-form>
  </q-page>
</template>

<script>
import modelosApi from 'src/api/modelos.api'

export default {
  name: 'ModeloPage',
  data() {
    return {
      object: {
        nome: '',
        descricao: '',
        conteudo: '',
      },
      edit: false,
      marcacoes: [
        '[contratante.nome]',
        '[contratante.cpfCnpj]',
        '[contratante.endereco]',
        '[contratante.assinatura]',
        '[contratado.nome]',
        '[contratado.cpfCnpj]',
        '[contratado.endereco]',
        '[contratado.assinatura]',
      ],
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
      this.$router.push({ name: 'modelos' })
    },
    getModeloById() {
      modelosApi
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
      modelosApi
        .create(this.object)
        .then(this.backToIndex())
        .catch((error) => {
          console.log(error)
        })
    },
    update() {
      modelosApi
        .update(this.object)
        .then(this.backToIndex())
        .catch((error) => {
          console.log(error)
        })
    },
    async copyText(text) {
      await navigator.clipboard.writeText(text)
    },
  },
}
</script>

<style></style>
