import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

export const setupAuthentication = () => {
  const rootElement = document.getElementById('root')

  const redirectToLogin = () => {
    window.location.replace(process.env.REACT_APP_LOGIN_URL)
  }

  const renderError = (message) => {
    ReactDOM.render(<div>{message}</div>, rootElement)
  }

  axios.interceptors.response.use(undefined, (error) => {
    const code = error.response.status

    if (code === 401) {
      redirectToLogin()
    } else {
      const error =
        code === 403 ? 'Missing required permissions' : 'Unexpected error'

      renderError(error)
    }

    return Promise.reject(error)
  })
}

export const ensureIsAuthorized = async () => {
  await axios.get('/auth')
}
