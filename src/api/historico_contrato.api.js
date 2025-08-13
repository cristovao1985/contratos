import { api, baseURL } from 'src/boot/axios'
const tableId = 'mb13yqkijda8ocs'
import session from 'src/helpers/session'
let tenant = await session.getUserTenant()

export default {
  getByIdContrato: async (hash) => {
    return api({
      method: 'get',
      url: `${baseURL}/${tableId}/records?where=(hash,eq,${hash})&sort=CreatedAt`,
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
  delete: async (Id) => {
    const data = {
      Id,
      tenant,
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
