import { useQuasar } from 'quasar'

export function useNotifications() {
  const $q = useQuasar()

  const showWarningMessage = (message: string) => {
    $q.notify({
      message,
      type: 'warning',
      position: 'top',
      timeout: 2000
    })
  }

  const showErrorMessage = (message: string) => {
    $q.notify({
      color: 'negative',
      message,
      icon: 'report_problem',
      position: 'top'
    })
  }

  const showSuccessMessage = (message: string) => {
    $q.notify({
      color: 'positive',
      message,
      icon: 'check'
    })
  }

  return {
    showWarningMessage, showErrorMessage, showSuccessMessage
  }
}