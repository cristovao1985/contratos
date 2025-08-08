<template>
  <span v-html="content.conteudo"></span>
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
      let contrato = JSON.parse(this.$route.params.contrato)

      if (contrato.assinatura_contratante) {
        const imgTag = `<img src="${contrato.assinatura_contratante}" style="height: 100px;" />`
        contrato = contrato.conteudo.replace(/\[contratante\.assinatura\]/g, imgTag)
      }
      if (contrato.assinatura_contratado) {
        const imgTag = `<img src="${contrato.assinatura_contratado}" style="height: 100px;" />`
        contrato = contrato.conteudo.replace(/\[contratado\.assinatura\]/g, imgTag)
      }
      this.content = contrato
      console.log(this.content)
    },
  },
}
</script>
