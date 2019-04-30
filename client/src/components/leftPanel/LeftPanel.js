import React from 'react'
import vacuumLogo from '../../assets/vacuum-logo-light.svg'
import './LeftPanel.scss'

function LeftPanel() {
  return (
    <div className="LeftPanel">
      <img className="logo" src={vacuumLogo} alt="VacuumLabs logo" />
      <strong className="sectionTitle">Select tag</strong>
      <ul>
        <li>All (656)</li>
        <li>Košice (123)</li>
        <li>Bratislava (100)</li>
        <li>HR (84)</li>
      </ul>
      <a className="showAll" href=".">Show all</a>
    </div>
  )
}

export default LeftPanel
