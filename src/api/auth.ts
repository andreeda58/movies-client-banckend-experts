// src/api/auth.ts
import { AxiosResponse } from 'axios'
import api from './api'
import { AuthLoginResponse, AuthRegisterResponse } from '../types'

export async function login(username: string, password: string): Promise<AuthLoginResponse> {
  const { data }: AxiosResponse<AuthLoginResponse> = await api.post('/auth/login/', { username, password })
  localStorage.setItem('token', data.token)
  localStorage.setItem('username', data.username)
  return data
}

export async function registerUser(form: { username: string; password: string; email?: string }): Promise<AuthRegisterResponse> {
  const { data }: AxiosResponse<AuthRegisterResponse> = await api.post('/auth/register/', form)
  localStorage.setItem('token', data.token)
  localStorage.setItem('username', data.username)
  return data
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout/')
  } catch {
    console.warn("Logout request failed")
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }
}
