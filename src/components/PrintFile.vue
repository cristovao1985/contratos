<template>
  <span v-html="content"></span>
</template>

<script>
export default {
  name: 'PrintFile',
  computed: {
    content() {
      let contrato = JSON.parse(this.$route.params.contrato)

      if (contrato.assinatura_contratante) {
        const imgTag = `<img src="${contrato.assinatura_contratante}" style="height: 100px;" />`
        contrato = contrato.conteudo.replace(/\[contratante\.assinatura\]/g, imgTag)
      }
      if (contrato.assinatura_contratado) {
        const imgTag = `<img src="${contrato.assinatura_contratado}" style="height: 100px;" />`
        contrato = contrato.conteudo.replace(/\[contratado\.assinatura\]/g, imgTag)
      }
      return contrato
    },
  },
  mounted() {
    console.log(this.$route.params)

    this.print()
  },
  methods: {
    print() {
      window.print()
    },
  },
}
</script>
