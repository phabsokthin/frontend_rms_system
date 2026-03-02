import { useToast } from 'vue-toast-notification'

export const useNotification = () => {
  const $toast = useToast()

  const notify = (options: any) => {
    return $toast.open({
      position: 'top-right',
      duration: 3000,
      ...options
    })
  }
  return { notify }
}