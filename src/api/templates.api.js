import { api, baseURL } from 'src/boot/axios'
const tableId = 'm2w8v0crgy4kzdc'
import session from 'src/helpers/session'
let tenant = await session.getUserTenant()

export default {
  getAll: async () => {
    return api({
      method: 'get',
      url: `${baseURL}/${tableId}/records`,
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
}

const clearObject = (data) => {
  let object = { ...data }
  delete object.CreatedAt
  delete object.UpdatedAt

  return object
}
