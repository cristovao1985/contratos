import { api, baseURL } from 'src/boot/axios'
const tableId = 'mymeu3bbewbub65'

export default {
  get: async (tenant) => {
    return await api({
      method: 'get',
      url: `${baseURL}/${tableId}/records?where=(fb_id,eq,${tenant})&sort=nome`,
    })
  },
  getByEmail: async (email) => {
    return await api({
      method: 'get',
      url: `${baseURL}/${tableId}/records?where=(email,eq,${email})`,
    })
  },
  create: async (data) => {
    return await api({
      method: 'post',
      url: `${baseURL}/${tableId}/records`,
      data,
    })
  },
  update: async (data) => {
    return await api({
      method: 'patch',
      url: `${baseURL}/${tableId}/records`,
      data,
    })
  },
  delete: async (id) => {
    const data = {
      Id: id,
    }

    return await api.delete({
      method: 'delete',
      url: `${baseURL}/${tableId}/records`,
      data,
    })
  },
  getByCPF: async (cpf) => {
    return await api.get({
      method: 'get',
      url: `${baseURL}/${tableId}/records?where=(cpf,eq,${cpf})`,
    })
  },
}
