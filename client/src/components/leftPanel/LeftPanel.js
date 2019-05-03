import React, { Component } from 'react'
import config from '../../config'
import vacuumLogo from '../../assets/vacuum-logo-light.svg'
import Tag from './Tag'
import './LeftPanel.scss'

class LeftPanel extends Component {
  constructor() {
    super()
    this.state = {
      tags: [],
      allVisible: true,
      selectedTag: null
    }
  }

  componentDidMount() {
    const { host, port } = config.server
    
    fetch(`${host}:${port}/api/tags`)
      .then(res => res.json())
      .then(tags => this.setState({tags, allVisible: tags.length <= config.tagCountLimit}));
  }

  toggleAllVisible = () => {
    this.setState({ allVisible: !this.state.allVisible })
  }

  setSelectedTag = (tag) => {
    this.setState({ selectedTag: tag })
  }

  render() {
    const { tags, allVisible } = this.state
    const tagsToShow = allVisible ? tags : tags.slice(0, config.tagCountLimit)

    return (
      <div className="LeftPanel">
        <img className="logo" src={vacuumLogo} alt="VacuumLabs logo" />
        <strong className="sectionTitle">Select tag</strong>
        <ul>
          {tagsToShow.map(tag => 
            (<Tag key={tag.tag} tag={tag} onClick={this.setSelectedTag} />)
          )}
        </ul>
        {!allVisible && <button type="button" className="showAll" onClick={this.toggleAllVisible}>Show all</button>}
      </div>
    )
  }
}

export default LeftPanel
