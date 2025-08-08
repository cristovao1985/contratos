import moment from 'moment'

export default {
  brazilFormat: (date) => {
    return date ? moment(date).format('DD/MM/YYYY') : 'Não Expira'
  },
  sqlDate: (date) => {
    return moment(date).format('YYYY-MM-DD')
  },
}
