import axios, { AxiosError } from "axios"

interface ApiErrorResponse {
  message?: string
}

export function handleApiError(
  error: unknown,
  defaultMessage: string
): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>

    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      defaultMessage

    throw new Error(message)
  }

  if (error instanceof Error) {
    throw new Error(error.message)
  }

  throw new Error(defaultMessage)
}