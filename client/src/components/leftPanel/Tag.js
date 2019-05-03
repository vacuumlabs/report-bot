import React, { Component } from 'react'
import './Tag.scss'

class Tag extends Component {
  handleClick = () => {
    const { tag: { tag }, onClick } = this.props
    onClick(tag)
  }

  render() {
    const { tag, count } = this.props.tag

    return (
      <li onClick={this.handleClick}>{tag} ({count})</li>
    )
  }
}

export default Tag
