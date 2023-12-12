import axios from 'axios'
import type { TokenResult } from './base'
import { apiBaseUrl, setAccessToken, setRefreshToken, clearToken, getRefreshToken } from './base'

export async function login(email: string, password: string) {
  const url = `${apiBaseUrl}/login`
  const response = await axios.post<TokenResult>(
    url,
    { email, password },
    { validateStatus: (status) => status === 200 },
  )
  setAccessToken(response.data.accessToken)
  setRefreshToken(response.data.refreshToken)
}

export async function logout() {
  clearToken()
  return Promise.resolve()
}

export async function checkUserAuthentication() {
  const islogin = !!getRefreshToken()
  return Promise.resolve(islogin)
}
