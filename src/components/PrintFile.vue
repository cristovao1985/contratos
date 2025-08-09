<template>
  <span v-html="content"></span>
</template>

<script>
export default {
  name: 'PrintFile',
  data() {
    return {
      content: '',
    }
  },
  async created() {
    await this.createContent()

    this.print()
  },
  methods: {
    print() {
      window.print()
    },
    async createContent() {
      try {
        let contrato = JSON.parse(this.$route.params.contrato)

        if (contrato.assinatura_contratante) {
          contrato.conteudo = await this.mountAssinaturaContratante(contrato)
        }
        if (contrato.assinatura_contratado) {
          contrato.conteudo = await this.mountAssinaturaContratado(contrato)
        }
        this.content = contrato.conteudo
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
