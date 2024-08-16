import { AxiosError } from 'axios'
import { Notify } from 'quasar'

export function showNotification(message: string, type: 'positive' | 'negative' | 'warning' | 'info' = 'info') {
  Notify.create({
    message,
    type,
    position: 'top',
    timeout: 2000
  })
}

export const showErrorRespNotification = (error: any) => showNotification(error.response?.data?.message || error.message, 'negative')