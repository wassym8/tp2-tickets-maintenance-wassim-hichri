import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

// GET /tickets
export async function getTickets() {
  const response = await api.get('/tickets')
  return response.data
}

// GET /tickets/:id
export async function getTicket(id) {
  const response = await api.get(`/tickets/${encodeURIComponent(id)}`)
  return response.data
}

// POST /tickets : statut "Ouvert" par défaut et date de création = date du jour
export async function createTicket(data) {
  const ticket = {
    ...data,
    statut: data.statut || 'Ouvert',
    dateCreation: new Date().toLocaleDateString('fr-CA'), // format AAAA-MM-JJ
  }
  const response = await api.post('/tickets', ticket)
  return response.data
}

// PUT /tickets/:id : remplace tout le ticket
export async function updateTicket(id, data) {
  const response = await api.put(`/tickets/${encodeURIComponent(id)}`, data)
  return response.data
}

// PATCH /tickets/:id : modifie seulement certains champs (ex. le statut)
export async function patchTicket(id, changes) {
  const response = await api.patch(`/tickets/${encodeURIComponent(id)}`, changes)
  return response.data
}

// DELETE /tickets/:id
export async function deleteTicket(id) {
  await api.delete(`/tickets/${encodeURIComponent(id)}`)
}
