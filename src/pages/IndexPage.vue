<template>
  <q-page class="q-ma-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary">Painel</div>
        <div class="text-subtitle2">Tela de acompanhamento de contratos e métricas</div>
      </q-card-section>
    </q-card>
    <Calendar :attributes="datas" expanded @dayclick="openDetail" />
    Legendas: <span class="text-primary">Contratos</span>
    <q-dialog v-model="showDetail">
      <q-card>
        <q-card-section>
          <span class="text-h5">Contratos para a data</span>
        </q-card-section>
        <q-card-section>
          <div v-for="alerta in alertas" :key="alerta">
            <span v-html="alerta.local" class="q-mr-lg" />
            <q-icon
              name="cake"
              size="32px"
              color="pink"
              style="cursor: pointer"
              v-if="['Aniversário de'].includes(alerta.local)"
            />
            <br />
            <q-separator />
            <br />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Fechar" @click="showDetail = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Calendar } from 'v-calendar'
import 'v-calendar/style.css'
import contratosApi from 'src/api/contratos.api'

export default {
  name: 'IndexPage',
  components: {
    Calendar,
  },
  data() {
    return {
      datas: [],
      showDetail: false,
    }
  },
  created() {
    this.getContratos()
  },
  methods: {
    getContratos() {
      contratosApi
        .getAll()
        .then((res) => {
          res.data.list.forEach((item) => {
            if (item.validade) {
              this.datas.push({
                local: `<strong class='text-primary'>${item.nome}</strong> </br> Contratante: ${item.contratante}. </br> Contratado: ${item.contratado}.</br>`,
                bar: 'positive',
                dates: [this.formatDate(item.validade)],
              })
            }
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    formatDate(date) {
      return `${date}T03:00:00.000Z`
    },
    openDetail(events) {
      this.alertas = events.attributes
      this.showDetail = true
      this.data = events.id
    },
  },
}
</script>
