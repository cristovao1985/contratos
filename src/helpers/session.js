import tenantsApi from 'src/api/tenants.api'
import { useCounterStore } from 'src/stores/example-store'
const store = useCounterStore()

export default {
  getUserTenant: async () => {
    const user = JSON.parse(localStorage.getItem('contrato-user'))

    return user.fb_id
  },
  hasAccess: async () => {
    const user = JSON.parse(localStorage.getItem('contrato-user'))

    await tenantsApi
      .get(user.fb_id)
      .then((res) => {
        const tenant = res.data.list[0]

        const dataSistema = new Date(tenant.validade)
        const hoje = new Date()

        // Comparar apenas data, sem considerar horas
        const dataSistemaSemHora = new Date(dataSistema.toISOString().split('T')[0])
        const hojeSemHora = new Date(hoje.toISOString().split('T')[0])

        if (dataSistemaSemHora <= hojeSemHora) {
          // conta expirada
          store.setUserAccess(false)
        } else {
          //conta valida

          store.setUserAccess(true)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
}
