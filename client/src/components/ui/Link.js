import React from 'react'
import './Link.scss'

function Link({ children, to }) {
  return (
    <a className='Link' href={to} target='_blank' rel='noopener noreferrer'>{children}</a>
  )
}

export default Link
