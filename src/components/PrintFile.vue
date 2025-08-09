<template>
  <span v-html="contrato.conteudo"></span>
</template>

<script>
import contratosApi from 'src/api/contratos.api'
export default {
  name: 'PrintFile',
  data() {
    return {
      contrato: {},
    }
  },
  async created() {
    await this.getContrato()
    await this.createContent()

    await this.print()
  },
  methods: {
    async print() {
      await window.print()
    },
    async getContrato() {
      await contratosApi
        .getById(this.$route.params.id)
        .then((res) => {
          this.contrato = res.data.list[0] || {}
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async createContent() {
      try {
        if (this.contrato.assinatura_contratante) {
          this.contrato.conteudo = await this.mountAssinaturaContratante(this.contrato)
        }
        if (this.contrato.assinatura_contratado) {
          this.contrato.conteudo = await this.mountAssinaturaContratado(this.contrato)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async mountAssinaturaContratante(contrato) {
      try {
        const imgTag = `<img src="${contrato.assinatura_contratante}" style="height: 100px;" />`
        return (contrato = contrato.conteudo.replace(/\[contratante\.assinatura\]/g, imgTag))
      } catch (error) {
        alert('Erro ao gerar assinatura contratante')
        console.log(error)
      }
    },
    async mountAssinaturaContratado(contrato) {
      try {
        const imgTag = `<img src="${contrato.assinatura_contratado}" style="height: 100px;" />`
        return (contrato = contrato.conteudo.replace(/\[contratado\.assinatura\]/g, imgTag))
      } catch (error) {
        alert('Erro ao gerar assinatura contratado')
        console.log(error)
      }
    },
  },
}
</script>
