// src/api/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE
})

// מוסיפים Token לכל בקשה אם קיים ב-localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

// טיפול בשגיאות מהשרת
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status ?? 500
    const message = error.response?.data?.detail || "Server error"
    console.error('API error:', status, message)
    return Promise.reject({ status, message })
  }
)

export default api
