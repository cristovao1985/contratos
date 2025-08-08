import axios from 'axios'

export default {
  solicitarAssinaturas: (data) => {
    return axios({
      method: 'post',
      url: 'https://web-n8n.ucgkrp.easypanel.host/webhook/84def3e4-cc34-4c9d-b042-7d9393896e67',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
  },
  solicitarAssinaturaDoContratante: (data) => {
    return axios({
      method: 'post',
      url: 'https://web-n8n.ucgkrp.easypanel.host/webhook/0520a586-1eff-45b7-90a5-eaf25ff9f076',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
  },
  solicitarAssinaturaDoContratado: (data) => {
    return axios({
      method: 'post',
      url: 'https://web-n8n.ucgkrp.easypanel.host/webhook/e0afc755-368a-4cf2-8e53-6aa5412b75bb',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
  },
  emailBoasVindas: (data) => {
    return axios({
      method: 'post',
      url: 'https://web-n8n.ucgkrp.easypanel.host/webhook/837ec28c-5d94-4c8b-ac67-d93c153d1042',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    })
  },
}
