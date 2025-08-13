<template>
  <q-dialog v-model="showModal">
    <q-card>
      <q-card-section>
        <q-card class="q-mb-md" style="width: 400px">
          <q-card-section>
            <div class="text-h6 text-primary">Histórico</div>
            <div class="text-subtitle2">Histórico do contrato</div>
          </q-card-section>
        </q-card>

        <div v-if="data.length">
          <q-timeline color="info" v-for="item in data" :key="item.Id">
            <q-timeline-entry :title="item.titulo" :subtitle="formatDate(item.CreatedAt)">
              <div></div>
            </q-timeline-entry>
          </q-timeline>
        </div>
        <div v-else><div class="text-h6">Nenhum registro encontrado</div></div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Fechar" @click="closeModal" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import dateHelper from 'src/helpers/dateHelper'
export default {
  props: ['show', 'data'],
  name: 'HistoricoComponent',
  computed: {
    showModal() {
      return this.show
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    formatDate(date) {
      return dateHelper.brazilDateTimeFormat(date)
    },
  },
}
</script>
