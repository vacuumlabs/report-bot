import React, { Component } from 'react'
import vacuumLogo from '../../assets/vacuum-logo-light.svg'
import Tag from './Tag'
import './LeftPanel.scss'

class LeftPanel extends Component {

  render() {
    const {tags} = this.props

    return (
      <div className="LeftPanel">
        <a href='/'>
          <img className="logo" src={vacuumLogo} alt="VacuumLabs logo" />
        </a>
        <strong className="sectionTitle">Select tag</strong>
        <ul>
          {tags.map((tag) =>
            (<Tag key={tag.tag} tag={tag} />)
          )}
        </ul>
      </div>
    )
  }
}

export default LeftPanel
