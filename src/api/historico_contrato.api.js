import { api, baseURL } from 'src/boot/axios'
const tableId = 'mb13yqkijda8ocs'

export default {
  getByIdContrato: async (hash) => {
    return api({
      method: 'get',
      url: `${baseURL}/${tableId}/records?where=(hash,eq,${hash})&sort=CreatedAt`,
    })
  },
  create: (data) => {
    return api({
      method: 'post',
      url: `${baseURL}/${tableId}/records`,
      data,
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
