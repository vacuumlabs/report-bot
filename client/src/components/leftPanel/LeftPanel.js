import React, { Component } from 'react'
import vacuumLogo from '../../assets/vacuum-logo-light.svg'
import config from '../../config'
import { Loader } from '../ui'
import Tag from './Tag'
import './LeftPanel.scss'

class LeftPanel extends Component {
  state = {
    allVisible: true,
  }

  componentWillReceiveProps(nextProps) {
    const { tags } = nextProps
    this.setState({
      allVisible: tags.length <= config.tagCountLimit,
    })
  }

  toggleAllVisible = () => {
    this.setState({ allVisible: !this.state.allVisible })
  }

  render() {
    const { loading, tags } = this.props
    const { allVisible } = this.state
    const tagsToShow = allVisible ? tags : tags.slice(0, config.tagCountLimit)

    return (
      <div className="LeftPanel">
        <a href='/'>
          <img className="logo" src={vacuumLogo} alt="VacuumLabs logo" />
        </a>
        <strong className="sectionTitle">Select tag</strong>
        { loading && <Loader light /> }
        { !loading && !tagsToShow.length && <span className="noTags">No tags found.</span>}
        <ul>
          {tagsToShow.map(tag => 
            (<Tag key={tag.tag} tag={tag} />)
          )}
        </ul>
        { !allVisible && <button type="button" className="showAll" onClick={this.toggleAllVisible}>Show all</button>}
      </div>
    )
  }
}

export default LeftPanel
