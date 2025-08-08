<template>
  <q-table
    :rows="rows"
    :loading="loading"
    :pagination="pagination"
    :columns="columns"
    :title="title"
    :filter="filter"
  >
    <template v-slot:top>
      <q-input outlined dense debounce="300" v-model="filter" placeholder="Pesquisar...">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-space />
      <q-btn icon="add" color="primary" label="Adicionar" :to="actionsPath" :disable="!hasAccess" />
    </template>
    <template v-slot:body-cell-assinatura_contratante="props">
      <q-td :props="props">
        <!-- <q-btn icon="schedule" flat round @click="openModal('historico', props.row.Id)" /> -->
        <q-chip dense :color="`${props.row.assinatura_contratante ? 'positive' : 'negative'}`" />
        {{ props.row.contratante }}
        <q-btn icon="more_vert" flat round :disable="!hasAccess">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                @click="sendEmailContratante(props.row)"
                v-if="!props.row.assinatura_contratante"
              >
                <q-item-section>Solicitar Assinatura</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                v-if="props.row.assinatura_contratante"
                @click="revogarAssinaturaContratante(props.row)"
              >
                <q-item-section>Revogar Assinatura</q-item-section>
              </q-item>
              <q-separator />
            </q-list>
          </q-menu>
        </q-btn>
      </q-td>
    </template>
    <template v-slot:body-cell-assinatura_contratado="props">
      <q-td :props="props">
        <!-- <q-btn icon="schedule" flat round @click="openModal('historico', props.row.Id)" /> -->
        <q-chip dense :color="`${props.row.assinatura_contratado ? 'positive' : 'negative'}`" />
        {{ props.row.contratado }}
        <q-btn icon="more_vert" flat round :disable="!hasAccess">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                @click="sendEmailContratado(props.row)"
                v-if="!props.row.assinatura_contratado"
              >
                <q-item-section>Solicitar Assinatura</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="revogarAssinaturaContratado(props.row)"
                v-if="props.row.assinatura_contratado"
              >
                <q-item-section>Revogar Assinatura</q-item-section>
              </q-item>
              <q-separator />
            </q-list>
          </q-menu>
        </q-btn>
      </q-td>
    </template>
    <template v-slot:body-cell-validade="props">
      <q-td :props="props">
        {{ formatDate(props.row.validade) }}
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <!-- <q-btn icon="schedule" flat round @click="openModal('historico', props.row.Id)" /> -->
        <q-btn
          icon="print"
          flat
          round
          @click="print(props.row)"
          v-if="showPrint"
          :disable="!hasAccess"
        />
        <q-btn
          icon="edit"
          flat
          round
          :to="`${actionsPath}/${props.row.Id}`"
          :disable="!hasAccess"
        />
        <q-btn
          icon="content_copy"
          flat
          @click="createCopy(props.row)"
          v-if="showCopy"
          :disable="!hasAccess"
        />
        <q-btn
          color="negative"
          icon="delete"
          flat
          round
          @click="deleteRow(props.row.Id)"
          :disable="!hasAccess"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script>
import session from 'src/helpers/session'
import dateHelper from '../helpers/dateHelper'
import { useCounterStore } from '../stores/example-store'
const store = useCounterStore()
export default {
  name: 'TableContratosComponent',
  props: ['rows', 'loading', 'columns', 'title', 'sort', 'actionsPath', 'showPrint', 'showCopy'],
  data() {
    return {
      filter: '',
      pagination: {
        sortBy: this.sort,
        descending: false,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
    }
  },
  created() {
    session.hasAccess()
  },
  computed: {
    hasAccess() {
      return store.hasAccess
    },
  },
  methods: {
    deleteRow(Id) {
      this.$emit('deleteRow', Id)
    },
    print(content) {
      this.$emit('print', content)
    },
    createCopy(row) {
      this.$emit('createCopy', row)
    },
    sendEmailContratante(row) {
      this.$emit('emailContratante', row)
    },
    sendEmailContratado(row) {
      this.$emit('emailContratado', row)
    },
    revogarAssinaturaContratante(row) {
      this.$emit('revogarAssinaturaContratante', row)
    },
    revogarAssinaturaContratado(row) {
      this.$emit('revogarAssinaturaContratado', row)
    },
    formatDate(date) {
      return dateHelper.brazilFormat(date)
    },
  },
}
</script>

<style></style>
