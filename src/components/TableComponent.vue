<template>
  <q-table
    :rows="rows"
    :loading="loading"
    :pagination="pagination"
    :columns="columns"
    :title="title"
    :filter="filter"
    color="primary"
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
    <!-- <template v-slot:body-cell-nome="props">
      <q-td :props="props">
        <span class="text-black">{{ props.row.nome }}?</span>
      </q-td>
    </template> -->
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
import { useCounterStore } from '../stores/example-store'
const store = useCounterStore()
export default {
  name: 'TableComponent',
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
  },
}
</script>

<style></style>
