<template>
  <q-page class="q-ma-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-primary">Templates</div>
        <div class="text-subtitle2">Modelos prontos para você usar</div>
      </q-card-section>
    </q-card>
    <h3>Em construção...</h3>
    <!-- <div class="row">
      <div class="col-3">
        <q-list bordered separator v-for="template in templates" :key="template.Id">
          <q-item clickable v-ripple @click="setConteudo(template.conteudo)">
            <q-item-section
              >{{ template.nome }} <br />
              <q-item-label caption>{{ template.descricao }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-actions align="right" dense>
            <q-btn icon="add" flat color="positive" round></q-btn>
          </q-card-actions>
        </q-list>
      </div>
      <div class="col-1"></div>
      <div class="col-7" v-if="conteudo">
        <q-card class="q-pa-md">
          <q-scroll-area style="height: 100vh; width: 100%">
            <div v-html="conteudo" />
          </q-scroll-area>
        </q-card>
      </div>
    </div> -->
  </q-page>
</template>

<script>
import templatesApi from '../../api/templates.api'
export default {
  name: 'IndexPage',
  data() {
    return {
      templates: [
        {
          nome: 'CONTRATO DE LOCAÇÃO DE IMÓVEL',
          conteudo: `CONTRATO DE LOCAÇÃO DE IMÓVEL

Pelo presente instrumento particular, as partes:   


LOCADOR: [contratante.nome], inscrito no CPF/CNPJ sob o nº [contratante.cpfCnpj], residente e domiciliado à [contratante.endereco].   


LOCATÁRIO: [contratado.nome], inscrito no CPF/CNPJ sob o nº [contratado.cpfCnpj], residente e domiciliado à [contratado.endereco]. Têm entre si, justo e contratado, o que segue: 

CLÁUSULA 1ª – DO OBJETO O LOCADOR aluga ao LOCATÁRIO o imóvel localizado em [endereço do imóvel], destinado exclusivamente para fins [residenciais/comerciais]. 


CLÁUSULA 2ª – DO PRAZO O presente contrato tem prazo de [X] meses, iniciando-se em [data inicial] e encerrando-se em [data final]. 


CLÁUSULA 3ª – DO VALOR E PAGAMENTO O aluguel mensal será de R$ [valor], a ser pago até o dia [dia] de cada mês, por meio de [forma de pagamento]. 


CLÁUSULA 4ª – DAS OBRIGAÇÕES O LOCATÁRIO compromete-se a zelar pelo imóvel e devolvê-lo nas mesmas condições recebidas, salvo deteriorações pelo uso normal.  

CLÁUSULA 5ª – DAS PENALIDADES O descumprimento de quaisquer cláusulas acarretará a rescisão contratual, além das penalidades previstas em lei.  E, por estarem justos e contratados, firmam o presente contrato em duas vias de igual teor. [local], [data]. [contratante.nome] CPF/CNPJ: [contratante.cpfCnpj] [contratante.assinatura] [contratado.nome] CPF/CNPJ: [contratado.cpfCnpj] [contratado.assinatura]`,
        },
        {
          nome: 'CONTRATO PARTICULAR DE COMPRA E VENDA DE IMÓVEL',
          conteudo: `CONTRATO PARTICULAR DE COMPRA E VENDA DE IMÓVEL


Pelo presente instrumento particular, as partes:


VENDEDOR: [contratante.nome], inscrito no CPF/CNPJ sob o nº [contratante.cpfCnpj], residente e domiciliado à [contratante.endereco].


COMPRADOR: [contratado.nome], inscrito no CPF/CNPJ sob o nº [contratado.cpfCnpj], residente e domiciliado à [contratado.endereco].


Têm entre si, justo e contratado, o que segue:

CLÁUSULA 1ª – DO OBJETO

O VENDEDOR vende ao COMPRADOR o imóvel localizado em [endereço do imóvel], registrado sob a matrícula nº [número da matrícula], no [cartório].

CLÁUSULA 2ª – DO PREÇO

O preço ajustado para a presente venda é de R$ [valor], a ser pago da seguinte forma: [detalhar forma de pagamento].

CLÁUSULA 3ª – DA POSSE E TRANSFERÊNCIA

A posse do imóvel será transmitida ao COMPRADOR após o pagamento integral do preço, juntamente com a assinatura da escritura definitiva.

CLÁUSULA 4ª – DAS RESPONSABILIDADES

O VENDEDOR declara que o imóvel está livre de quaisquer ônus, dívidas ou pendências judiciais.

CLÁUSULA 5ª – DAS PENALIDADES

O descumprimento deste contrato implicará multa equivalente a [X]% do valor total, além das demais penalidades previstas em lei.

E, por estarem justos e contratados, firmam o presente contrato em duas vias de igual teor.

[local], [data].

[contratante.nome]

CPF/CNPJ: [contratante.cpfCnpj]

[contratante.assinatura]

[contratado.nome]

CPF/CNPJ: [contratado.cpfCnpj]

[contratado.assinatura]

 `,
        },
      ],
      conteudo: '',
    }
  },
  created() {
    //this.getAll()
  },
  methods: {
    async getAll() {
      await templatesApi
        .getAll()
        .then((res) => {
          this.templates = res.data.list
        })
        .catch((error) => {
          console.log(error)
        })
    },
    setConteudo(conteudo) {
      this.conteudo = conteudo
        .replace(/\\\[/g, '[') // tira as barras antes dos colchetes
        .replace(/\\\]/g, ']')
        .replace(/\n/g, '<br>') // quebra de linha vira <br>
    },
  },
}
</script>

<style></style>
