import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
}

export const bookingAPI = {
  getAvailability: (date, guests) => api.get(`/bookings/availability/${date}`, { params: { guests } }),
  createBooking: (data) => api.post('/bookings', data),
  getCustomerBookings: (customerId) => api.get(`/bookings/customer/${customerId}`),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`)
}

export const menuAPI = {
  getAllItems: (category) => api.get('/menu', { params: { category } }),
  getItem: (id) => api.get(`/menu/${id}`)
}

export const tableAPI = {
  getAllTables: () => api.get('/tables')
}

export default api
