<template>
  <q-page class="q-ma-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary">Pessoas</div>
        <div class="text-subtitle2">
          Gerenciamento de pessoas signatárias como partes contratante ou contratada em um contrato
        </div>
      </q-card-section>
      <q-linear-progress indeterminate v-if="loading" />
    </q-card>

    <TableComponent
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :sort="'nome'"
      :title="'Pessoas para Contratos'"
      :actionsPath="'/pessoa'"
      @deleteRow="deleteRow"
    />
  </q-page>
</template>

<script>
import TableComponent from 'src/components/TableComponent'
import pessoasApi from '../../api/pessoas.api'
import showMessage from '../../boot/notify'
export default {
  name: 'PessoasPage',
  components: {
    TableComponent,
  },
  data() {
    return {
      rows: [],
      columns: [
        { field: 'Id', label: '#', align: 'left' },
        { field: 'nome', label: 'Nome', align: 'left' },
        { field: 'email', label: 'Email', align: 'left' },
        { field: 'tipo_pessoa', label: 'Tipo Pessoa', align: 'left' },
        { label: 'Ações', name: 'actions', align: 'left' },
      ],
      sort: 'nome',
      loading: true,
    }
  },
  async created() {
    await this.getAll()
  },
  methods: {
    async getAll() {
      await pessoasApi
        .getAll()
        .then((res) => {
          this.rows = res.data.list || []
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    deleteRow(Id) {
      this.loading = true
      pessoasApi
        .delete(Id)
        .then(() => {
          showMessage.success('Pessoa removida com sucesso!')
          this.getAll()
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
  },
}
</script>
