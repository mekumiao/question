import axios from 'axios'
import router from '@/router'
import { useCurrentUser } from '@/stores/user'

export class ValidationProblemError extends Error {
  public type: string = ''
  public title: string = ''
  public status: number = 400
  public readonly detail: string
  public readonly errors: string[]
  public traceId: string = ''

  public constructor(detail: string, errors: string[]) {
    super(detail)
    this.detail = detail
    this.errors = errors
  }
}

export interface TokenResult {
  tokenType: string
  accessToken: string
  expiresIn: number
  refreshToken: string
}

export const apiBaseUrl = `${import.meta.env.VITE_GLOB_API_HOST}${
  import.meta.env.VITE_GLOB_API_PREFIX
}`

const axiosInstance = axios.create({
  timeout: import.meta.env.VITE_GLOB_AXIOS_TIMEOUT || undefined,
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getToken().accessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newAccessToken = await refreshAccessTokenAndStore()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (error) {
        logout()
        return Promise.reject(error)
      }
    } else if (error.response.status === 400) {
      const data = error.response.data
      const problem = new ValidationProblemError(data.detail, data.errors)
      Object.assign(problem, data)
      return Promise.reject(problem)
    }
    return Promise.reject(error)
  },
)

function logout() {
  setToken()
  useCurrentUser().setUser()
  router.push({ name: 'login' })
}

/**
 * 刷新和存储token
 * @returns accessToken
 */
async function refreshAccessTokenAndStore() {
  const refresh_token = getToken().refreshToken
  if (!refresh_token) {
    setToken()
    return Promise.reject(new Error('refresh_token is null'))
  }
  try {
    const response = await axios.post<TokenResult>(
      `${apiBaseUrl}/refresh`,
      {
        refreshToken: refresh_token,
      },
      {
        validateStatus: (status) => status === 200,
      },
    )
    setToken({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    })
    return response.data.accessToken
  } catch (error) {
    return Promise.reject(error)
  }
}

export function setToken(token?: { accessToken: string; refreshToken: string }) {
  if (token) {
    window.localStorage.setItem('access_token', token.accessToken)
    window.localStorage.setItem('refresh_token', token.refreshToken)
  } else {
    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('refresh_token')
  }
}

export function getToken() {
  return {
    accessToken: window.localStorage.getItem('access_token'),
    refreshToken: window.localStorage.getItem('refresh_token'),
  }
}

export default axiosInstance
