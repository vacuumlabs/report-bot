import React, { Component } from 'react'
import vacuumLogo from '../../assets/vacuum-logo-light.svg'
import Tag from './Tag'
import './LeftPanel.scss'

class LeftPanel extends Component {

  state = {
    searchString: ""
  }

  handleChange = (event) => this.setState({ searchString: event.target.value })
  
  render() {
    const {tags} = this.props
    const {searchString} = this.state
    const lowerCaseSearchString = searchString.trim().toLowerCase();

    return (
      <div className="LeftPanel">
        <a href='/'>
          <img className="logo" src={vacuumLogo} alt="VacuumLabs logo" />
        </a>
        <strong className="sectionTitle">Select tag</strong>
        <input
          type="text"
          value={searchString}
          onChange={this.handleChange}
          placeholder="search"
        />
        <ul>
          {tags
            .filter(({tag}) => tag.toLowerCase().includes(lowerCaseSearchString))
            .map((tag) => (<Tag key={tag.tag} tag={tag} />)
          )}
        </ul>
      </div>
    )
  }
}

export default LeftPanel
