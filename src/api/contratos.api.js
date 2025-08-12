import { api, baseURL } from 'src/boot/axios'
const tableId = 'm11o2et2y5wjgbc'
import session from 'src/helpers/session'
let tenant = await session.getUserTenant()

export default {
  getAll: async () => {
    return api({
      method: 'get',
      url: `${baseURL}/${tableId}/records?where=(tenant,eq,${tenant})`,
    })
  },
  getById: async (Id) => {
    return api({
      method: 'get',
      url: `${baseURL}/${tableId}/records?where=(tenant,eq,${tenant})~and(Id,eq,${Id})`,
    })
  },
  create: (data) => {
    data.tenant = tenant
    return api({
      method: 'post',
      url: `${baseURL}/${tableId}/records`,
      data,
    })
  },
  update: (data) => {
    data.tenant = tenant
    return api({
      method: 'patch',
      url: `${baseURL}/${tableId}/records`,
      data: clearObject(data),
    })
  },
  delete: async (Id) => {
    const data = {
      Id,
    }

    return api({
      method: 'delete',
      url: `${baseURL}/${tableId}/records`,
      data: clearObject(data),
    })
  },
  validarContratoPorContratanteIdContrato: (emailContratante, idContrato) => {
    return api({
      method: 'get',
      url: `${baseURL}/${tableId}/records?where=(email_contratante,eq,${emailContratante})~and(Id,eq,${idContrato})`,
    })
  },
  validarContratoPorContratadoIdContrato: (emailContratado, idContrato) => {
    return api({
      method: 'get',
      url: `${baseURL}/${tableId}/records?where=(email_contratado,eq,${emailContratado})~and(Id,eq,${idContrato})`,
    })
  },
}

const clearObject = (data) => {
  let object = { ...data }
  delete object.CreatedAt
  delete object.UpdatedAt

  return object
}
