import axios from 'axios'

import { BlobDataResult } from '@/types'

async function fetchBlobData(endpointUrl: string, id: number): Promise<BlobDataResult> {
  endpointUrl = endpointUrl.slice(endpointUrl.length - 1) !== '/' ? `${endpointUrl}/` : endpointUrl

  try {
    const response = await axios.get(endpointUrl + id, {
      responseType: 'blob',
      timeout: 120000
    })
    return { data: response.data, contentType: response.headers['content-type'] }
  } catch {
    return { error: true }
  }
}

export function openBlob(data: ArrayBuffer, contentType: string): void {
  const blob = new Blob([data], {
    type: contentType
  })
  const url = URL.createObjectURL(blob)
  const anchorEl = document.createElement('a')
  anchorEl.href = url
  document.body.appendChild(anchorEl)
  window.open(anchorEl.href, '_blank')
  URL.revokeObjectURL(anchorEl.href)
}

export function saveBlob(fileName: string, data: ArrayBuffer, contentType: string): void {
  const blob = new Blob([data], {
    type: contentType
  })
  const url = URL.createObjectURL(blob)
  const anchorEl = document.createElement('a')
  anchorEl.href = url
  anchorEl.download = fileName
  document.body.appendChild(anchorEl)
  anchorEl.click()
  URL.revokeObjectURL(anchorEl.href)
}

export async function fetchAndOpenBlob(
  id: number,
  fileName: string,
  url: string
): Promise<boolean> {
  const result = await fetchBlobData(url, id)
  if (result.error) {
    return false
  }
  openBlob(result.data, result.contentType ?? '')
  return true
}

export async function fetchAndSaveBlob(
  id: number,
  fileName: string,
  url: string
): Promise<boolean> {
  const result = await fetchBlobData(url, id)
  if (result.error) {
    return false
  }
  saveBlob(fileName, result.data, result.contentType ?? '')
  return true
}
