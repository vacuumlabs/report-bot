import React, { Component } from 'react'
import vacuumLogo from '../../assets/vacuum-logo-light.svg'
import Tag from './Tag'
import './LeftPanel.scss'

class LeftPanel extends Component {

  state = {
    searchString: "",
    showArchived: false,
  }

  handleChange = (event) => this.setState({ searchString: event.target.value })
  
  onShowArchivedChange = (event) => this.setState({showArchived: event.target.checked})

  render() {
    const {tags} = this.props
    const {searchString, showArchived} = this.state
    const lowerCaseSearchString = searchString.trim().toLowerCase();

    return (
      <div className={`LeftPanelContainer${searchString ? '' : ' padded'}`}>
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
          {!searchString && (
	          <ShowArchivedBox
		          label="show archived projects"
		          isChecked={showArchived}
		          onChange={this.onShowArchivedChange}
	          />
          )}
          <ul>
            {tags
              .filter(
                ({tag, isArchived}) =>
                  tag.toLowerCase().includes(lowerCaseSearchString) &&
                  (searchString || !isArchived || showArchived)
              )
              .map((tag) => (<Tag key={tag.tag} tag={tag} />))
            }
          </ul>
        </div>
      </div>
    )
  }
}

function ShowArchivedBox({label, isChecked, onChange}) {
  return (
    <label className="ShowArchivedBox">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
      />
      {label}
    </label>
  )
}

export default LeftPanel
