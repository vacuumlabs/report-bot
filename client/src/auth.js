import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import config from './config'

export const setupAuthentication = () => {
  const rootElement = document.getElementById('root')

  const redirectToLogin = () => {
    window.location.replace(config.loginUrl)
  }

  const renderError = (message) => {
    ReactDOM.render(<div className="error">{message}</div>, rootElement)
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
