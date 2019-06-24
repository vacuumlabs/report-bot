import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import './Tag.scss'

class Tag extends Component {
  render() {
    const { tag, count } = this.props.tag

    return (
      <li>
        <RouterLink className='tagLink' to={`/${encodeURI(tag)}`}>
          {tag} ({count})
        </RouterLink>
      </li>
    )
  }
}

export default Tag
