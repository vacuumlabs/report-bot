import React, { Component } from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {parseTs} from '../../utils/helpers'
import archivedIcon from '../../assets/archive.svg'
import './Tag.scss'

class Tag extends Component {
  render() {
    const {tag, count, lastTs, isArchived, isLate} = this.props.tag

    return (
      <li>
        <RouterLink className={`tagLink${isLate?' late':''}`} to={`/${encodeURI(tag)}`}>
          <span className="tagTitle">
            {tag} ({count})
            {isArchived && <img className="archived" src={archivedIcon} alt="archived" />}
          </span>
          <br/>
          <span className="lastTs">{parseTs(lastTs).fromNow()}</span>
        </RouterLink>
      </li>
    )
  }
}

export default Tag
