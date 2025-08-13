<template>
  <q-page class="q-ma-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary">Contratos</div>
        <div class="text-subtitle2">Gerenciamento de Contratos entre você e seus clientes</div>
      </q-card-section>
      <q-linear-progress indeterminate v-if="loading" />
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
      @historicoContrato="getHistoricoContrato"
    />
    <Historico
      :data="historico"
      :show="showModal.historico"
      @closeModal="closeModal('historico')"
    />
  </q-page>
</template>

<script>
import TableContratosComponent from 'src/components/TableContratosComponent'
import contratosApi from '../../api/contratos.api'
import webhookApi from 'src/api/webhook.api'
import showMessage from '../../boot/notify'
import historico_contratoApi from 'src/api/historico_contrato.api'
import Historico from 'src/components/Historico'
export default {
  name: 'ContratosPage',
  components: {
    TableContratosComponent,
    Historico,
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
      historico: [],
      showModal: {
        historico: false,
      },
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
    deleteRow({ Id, hash }) {
      this.loading = true
      contratosApi
        .delete(Id)
        .then(() => {
          showMessage.success('Contrato removido com sucesso')
          historico_contratoApi.create({
            titulo: 'Contrato deletado',
            hash: hash,
          })
          this.getAll()
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    imprimirContrato(contrato) {
      const route = this.$router.resolve({
        name: 'print-contrato',
        params: {
          id: contrato.Id,
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
          showMessage.success('Cópia de contrato criada com sucesso!')
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
        nome_contrato: row.nome,
      }
      webhookApi
        .solicitarAssinaturaDoContratante(data)
        .then(showMessage.success(`Email para ${row.contratante} enviando com sucesso!`))
        .catch((error) => {
          console.log(error)
          showMessage.error('Houve um erro ao enviar email para', row.contratante)
        })
      historico_contratoApi.create({
        titulo: 'Solicitação de assinatura do contratante',
        hash: row.hash,
      })
    },
    emailContratado(row) {
      const data = {
        contratado: row.contratado,
        email_contratado: row.email_contratado,
        id_contrato: row.Id,
        nome_contrato: row.nome,
      }
      webhookApi
        .solicitarAssinaturaDoContratado(data)
        .then(showMessage.success(`Email para ${row.contratado} enviando com sucesso!`))
        .catch((error) => {
          console.log(error)
          showMessage.error('Houve um erro ao enviar email para', row.contratado)
        })
      historico_contratoApi.create({
        titulo: 'Solicitação de assinatura do contratado',
        hash: row.hash,
      })
    },
    async revogarAssinaturaContratante(row) {
      this.loading = true
      row.assinatura_contratante = ''
      await contratosApi
        .update(row)
        .then(() => {
          this.getAll()
          showMessage.success(
            'Assinatura do Contratante foi revogada com sucesso! Solicite uma nova assinatura',
          )
          historico_contratoApi.create({
            titulo: 'Revogada a assinatura do contratante',
            hash: row.hash,
          })
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
          showMessage.success(
            'Assinatura do Contratado foi revogada com sucesso! Solicite uma nova assinatura',
          )
          historico_contratoApi.create({
            titulo: 'Revogada a assinatura do contratado',
            hash: row.hash,
          })
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    async getHistoricoContrato(hash) {
      this.loading = true
      await historico_contratoApi
        .getByIdContrato(hash)
        .then((res) => {
          this.historico = res.data.list

          this.openModal('historico')
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
    },
    openModal(modal) {
      this.showModal[modal] = true
    },
    closeModal(modal) {
      this.showModal[modal] = false
    },
  },
}
</script>
