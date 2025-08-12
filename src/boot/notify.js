import { Notify } from 'quasar'

export default {
  success: (message) => {
    Notify.create({
      message: message.toUpperCase(),
      color: 'positive',
      timeout: 2000,
      type: 'positive',
      position: 'top',
    })
  },
  error: (message) => {
    Notify.create({
      message: message.toUpperCase(),
      color: 'negative',
      timeout: 2000,
      type: 'negative',
      position: 'top',
    })
  },
  warning: (message) => {
    Notify.create({
      message: message.toUpperCase(),
      color: 'warning',
      timeout: 2000,
      type: 'warning',
      position: 'top',
    })
  },
}
