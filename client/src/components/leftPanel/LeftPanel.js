import React, { Component } from 'react'
import vacuumLogo from '../../assets/vacuum-logo-light.svg'
import config from '../../config'
import { getTags } from '../../utils/serverApi'
import Tag from './Tag'
import './LeftPanel.scss'

class LeftPanel extends Component {
  state = {
    allVisible: true,
    tags: [],
  }

  async componentDidMount() {
    const tags = await getTags()

    this.setState({
      allVisible: tags.length <= config.tagCountLimit,
      tags,
    })
  }

  toggleAllVisible = () => {
    this.setState({ allVisible: !this.state.allVisible })
  }

  render() {
    const { onSelectTag } = this.props
    const { allVisible, tags } = this.state
    const tagsToShow = allVisible ? tags : tags.slice(0, config.tagCountLimit)

    return (
      <div className="LeftPanel">
        <a href='/'>
          <img className="logo" src={vacuumLogo} alt="VacuumLabs logo" />
        </a>
        <strong className="sectionTitle">Select tag</strong>
        <ul>
          {tagsToShow.map(tag => 
            (<Tag key={tag.tag} tag={tag} onClick={ onSelectTag } />)
          )}
        </ul>
        {!allVisible && <button type="button" className="showAll" onClick={this.toggleAllVisible}>Show all</button>}
      </div>
    )
  }
}

export default LeftPanel
