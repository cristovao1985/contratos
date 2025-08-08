<template>
  <q-page class="q-ma-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary">Contratos</div>
        <div class="text-subtitle2">Gerenciamento de Contratos entre você e seus clientes</div>
      </q-card-section>
    </q-card>

    <TableContratosComponent
      :rows="rows"
      :loading="loading"
      :columns="columns"
      :sort="'nome'"
      :title="'Contratos'"
      :actionsPath="'/contrato'"
      @deleteRow="deleteRow"
      :showPrint="true"
      @print="imprimirContrato"
      :showCopy="true"
      @createCopy="createCopy"
      @emailContratante="emailContratante"
      @emailContratado="emailContratado"
      @revogarAssinaturaContratante="revogarAssinaturaContratante"
      @revogarAssinaturaContratado="revogarAssinaturaContratado"
    />
  </q-page>
</template>

<script>
import TableContratosComponent from 'src/components/TableContratosComponent'
import contratosApi from '../../api/contratos.api'
import webhookApi from 'src/api/webhook.api'
export default {
  name: 'ContratosPage',
  components: {
    TableContratosComponent,
  },
  data() {
    return {
      rows: [],
      columns: [
        { field: 'Id', label: '#', align: 'left' },
        { field: 'nome', label: 'Nome', align: 'left' },
        //{ field: 'categoria', label: 'Categoria', align: 'left' },
        { field: 'validade', name: 'validade', label: 'Validade', align: 'left' },
        {
          name: 'assinatura_contratante',
          field: 'assinatura_contratante',
          label: 'Contratante',
          align: 'left',
        },
        {
          name: 'assinatura_contratado',
          field: 'assinatura_contrado',
          label: 'Contratado',
          align: 'left',
        },
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
      await contratosApi
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
      contratosApi
        .delete(Id)
        .then(() => {
          this.getAll()
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    imprimirContrato(contrato) {
      const route = this.$router.resolve({
        name: 'print',
        params: {
          contrato: JSON.stringify(contrato),
        },
      })

      window.open(route.href, '_blank')
    },
    async createCopy(row) {
      this.loading = true
      delete row.CreatedAt
      delete row.UpdatedAt
      delete row.Id
      row.nome = `Cópia de ${row.nome}`

      await contratosApi
        .create(row)
        .then(() => {
          this.getAll()
          alert('Cópia de contrato criada com sucesso!')
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    emailContratante(row) {
      const data = {
        contratante: row.contratante,
        email_contratante: row.email_contratante,
        id_contrato: row.Id,
        nome: row.nome,
      }
      webhookApi
        .solicitarAssinaturaDoContratante(data)
        .then(alert('Email para contratante enviando com sucesso!'))
        .catch((error) => {
          console.log(error)
          alert('Houve um erro ao enviar email para', row.email_contratante)
        })
    },
    emailContratado(row) {
      const data = {
        contratado: row.contratado,
        email_contratado: row.email_contratado,
        id_contrato: row.Id,
        nome: row.nome,
      }
      webhookApi
        .solicitarAssinaturaDoContratado(data)
        .then(alert('email para contratado enviando com sucesso!'))
        .catch((error) => {
          console.log(error)
          alert('Houve um erro ao enviar email para', row.email_contratado)
        })
    },
    async revogarAssinaturaContratante(row) {
      this.loading = true
      row.assinatura_contratante = ''
      await contratosApi
        .update(row)
        .then(() => {
          this.getAll()
          alert('Assinatura do Contratante foi revogada com sucesso!')
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    async revogarAssinaturaContratado(row) {
      this.loading = true
      row.assinatura_contratado = ''
      await contratosApi
        .update(row)
        .then(() => {
          this.getAll()
          alert('Assinatura do Contratado foi revogada com sucesso!')
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
  },
}
</script>
