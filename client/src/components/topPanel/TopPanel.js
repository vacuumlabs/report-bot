import React from 'react'
import './TopPanel.scss'

function TopPanel({iconText, title}) {
  return (
    <div className="TopPanel">
      <div className="icon">{iconText}</div>
      <h2 className="title">{title}</h2>
    </div>
  )
}

export default TopPanel
