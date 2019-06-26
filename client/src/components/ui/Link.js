import React from 'react'
import classnames from 'classnames'
import './Link.scss'

function Link({ children, className, to }) {
  return (
    <a className={classnames('Link', className)} href={to} target='_blank' rel='noopener noreferrer'>{children}</a>
  )
}

export default Link
