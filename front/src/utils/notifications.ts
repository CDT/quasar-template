import { Notify } from 'quasar'

export function showNotification(message: string, type: 'positive' | 'negative' | 'warning' | 'info' = 'info') {
  Notify.create({
    message,
    type,
    position: 'top',
    timeout: 2000
  })
}