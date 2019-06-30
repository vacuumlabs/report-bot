import React from 'react'
import './Link.scss'

function Link({ children, className = '', to }) {
  return (
    <a className={`Link ${className}`} href={to} target='_blank' rel='noopener noreferrer'>{children}</a>
  )
}

export default Link
