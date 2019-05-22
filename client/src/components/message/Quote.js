import React from 'react'
import './Quote.scss'

function Quote({ children }) {
  return (
    <div className='Quote'>{children.trim()}</div>
  )
}

export default Quote
