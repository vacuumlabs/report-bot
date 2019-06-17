import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {setupAuthentication, ensureIsAuthorized} from './auth'

const rootElement = document.getElementById('root')
ReactDOM.render(<div/>, rootElement)
setupAuthentication()

const renderApp = async () => {
  await ensureIsAuthorized()

  ReactDOM.render(<App />, rootElement)
}

renderApp()
