import React, { Component } from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {parseTs} from '../../utils/helpers'
import './Tag.scss'

class Tag extends Component {
  render() {
    const {tag, count, lastTs} = this.props.tag

    return (
      <li>
        <RouterLink className={'tagLink'} to={`/${encodeURI(tag)}`}>
          {tag} ({count}) <br/>
          <span className="lastTs">{parseTs(lastTs).fromNow()}</span>
        </RouterLink>
      </li>
    )
  }
}

export default Tag
