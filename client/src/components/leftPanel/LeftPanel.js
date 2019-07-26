import React, { Component } from 'react'
import vacuumLogo from '../../assets/vacuum-logo-light.svg'
import config from '../../config'
import { getTags } from '../../utils/serverApi'
import { Loader } from '../ui'
import Tag from './Tag'
import './LeftPanel.scss'

class LeftPanel extends Component {
  state = {
    loading: true,
    tags: [],
  }

  async componentDidMount() {
    const tags = await getTags()

    this.setState({
      loading: false,
      tags,
    })
  }

  render() {
    const { onSelectTag, dataLoading } = this.props
    const { loading, tags } = this.state

    return (
      <div className="LeftPanel">
        <a href='/'>
          <img className="logo" src={vacuumLogo} alt="VacuumLabs logo" />
        </a>
        <strong className="sectionTitle">Select tag</strong>
        { loading && <Loader light /> }
        {
          !loading && <ul>
            {tags.map(tag => 
              (<Tag key={tag.tag} tag={tag} onClick={ onSelectTag } dataLoading={dataLoading} />)
            )}
          </ul>
        }
      </div>
    )
  }
}

export default LeftPanel
