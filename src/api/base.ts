import axios from 'axios'

export interface PoDetail {
  details: string[]
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
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken()
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
        const newAccessToken = await refreshAccessToken()
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError)
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export function getAccessToken() {
  return localStorage.getItem('access_token')
}

export function setAccessToken(token: string) {
  localStorage.setItem('access_token', token)
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token')
}

export function setRefreshToken(token: string) {
  return localStorage.setItem('refresh_token', token)
}

export function clearToken() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

async function refreshAccessToken() {
  const refresh_token = getRefreshToken()
  if (refresh_token) {
    try {
      const response = await axios.post<TokenResult>(`${apiBaseUrl}/refresh`, {
        refreshToken: refresh_token,
      })
      if (response.status === 200) {
        setRefreshToken(response.data.refreshToken)
        setAccessToken(response.data.accessToken)
        return response.data.accessToken
      }
    } catch (error) {
      console.error(error)
    }
  }
  return clearToken()
}

export default axiosInstance
