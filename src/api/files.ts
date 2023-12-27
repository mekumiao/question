import axios from './base'
import { apiBaseUrl } from './base'

export interface AppFile {
  fileId: number
  uploadUserId: number
  uploadUserName: string
  size: number
  uploadTime: string
  uploadFileName: string
  extensionName: string
}

export interface AppFileInput {
  fileName: string
  file: File
}

export async function upload(input: AppFileInput) {
  const formData = new FormData()
  formData.append('fileName', input.fileName)
  formData.append('file', input.file)
  const resp = await axios.post<AppFile>(`/files/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return resp.data
}

export async function getFile(fileId: number) {
  const resp = await axios.get<AppFile>(`/files/${fileId}/`)
  return resp.data
}

export function joinFileUrl(fileId: number) {
  return `${apiBaseUrl}/files/${fileId}/content`
}
