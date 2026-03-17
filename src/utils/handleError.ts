// import axios, { AxiosError } from "axios"

// interface ApiErrorResponse {
//   message?: string
// }

// export function handleApiError(
//   error: unknown,
//   defaultMessage: string
// ): never {
//   if (axios.isAxiosError(error)) {
//     const axiosError = error as AxiosError<ApiErrorResponse>

//     const message =
//       axiosError.response?.data?.message ||
//       axiosError.message ||
//       defaultMessage

//     throw new Error(message)
//   }

//   if (error instanceof Error) {
//     throw new Error(error.message)
//   }

//   throw new Error(defaultMessage)
// }



import axios, { AxiosError } from "axios"

interface ApiErrorResponse {
  message?: string
}

let hasLoggedOut = false; // prevent multiple redirects

export function handleApiError(
  error: unknown,
  defaultMessage: string
): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>

    const status = axiosError.response?.status

    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      defaultMessage

    //Handle 401 Unauthorized
    if (status === 401 && !hasLoggedOut) {
      hasLoggedOut = true

      localStorage.clear()

      // use replace to prevent back navigation
      window.location.replace("http://localhost:5001/login")

       throw new Error(message)
    }

    throw new Error(message)
  }

  if (error instanceof Error) {
    throw new Error(error.message)
  }

  throw new Error(defaultMessage)
}