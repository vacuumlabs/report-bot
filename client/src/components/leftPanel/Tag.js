import React, { Component } from 'react'
import './Tag.scss'

class Tag extends Component {
  handleClick = () => {
    const { tag: { tag }, onClick } = this.props
    onClick(tag)
  }

  render() {
    const { dataLoading, tag: { tag, count } } = this.props

    return (
      <li>
        <button disabled={dataLoading} onClick={this.handleClick}>{tag} ({count})</button>
      </li>
    )
  }
}

export default Tag
