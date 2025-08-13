<template>
  <q-page class="q-ma-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary">Modelos Contratos</div>
        <div class="text-subtitle2">
          Modelos de Contratos para serem reutilizados em contratos futuros
        </div>
      </q-card-section>
      <q-linear-progress indeterminate v-if="loading" />
    </q-card>

    <TableComponent
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :sort="'nome'"
      :title="'Modelos de Contratos'"
      :actionsPath="'/modelo'"
      :showCopy="true"
      @deleteRow="deleteRow"
      @createCopy="createCopy"
      :showPrint="true"
      @print="imprimirModelo"
    />
  </q-page>
</template>

<script>
import TableComponent from 'src/components/TableComponent'
import modelosApi from '../../api/modelos.api'
import showMessage from '../../boot/notify'
export default {
  name: 'ModelosPage',
  components: {
    TableComponent,
  },
  data() {
    return {
      rows: [],
      columns: [
        { field: 'Id', label: '#', align: 'left' },
        { field: 'nome', name: 'nome', label: 'Nome', align: 'left' },
        { field: 'descricao', label: 'Descrição', align: 'left' },
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
      await modelosApi
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
      modelosApi
        .delete(Id)
        .then(() => {
          showMessage.success('Modelo removido com sucesso')
          this.getAll()
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    async createCopy(row) {
      this.loading = true
      const modelo = {
        nome: `Cópia de ${row.nome}`,
        conteudo: row.conteudo,
        descricao: row.descricao,
        tenant: row.tenant,
      }
      await modelosApi
        .create(modelo)
        .then(() => {
          this.getAll()
          showMessage.success('Cópia de modelo contrato criada com sucesso!')
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    imprimirModelo(modelo) {
      const route = this.$router.resolve({
        name: 'print-modelo',
        params: {
          id: modelo.Id,
        },
      })

      window.open(route.href, '_blank')
    },
  },
}
</script>
