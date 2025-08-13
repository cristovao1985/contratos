import moment from 'moment'

export default {
  brazilFormat: (date) => {
    return date ? moment(date).format('DD/MM/YYYY') : 'Não Definida'
  },
  brazilDateTimeFormat: (date) => {
    return date ? moment(date).format('DD/MM/YYYY hh:mm:ss') : 'Não Definida'
  },
  sqlDate: (date) => {
    return moment(date).format('YYYY-MM-DD')
  },
}
