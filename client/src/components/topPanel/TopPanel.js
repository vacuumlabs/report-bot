import React from 'react'
import { Emoji } from '../ui'
import './TopPanel.scss'

function TopPanel({ customEmojis, selectedTag }) {
  const showEmoji = selectedTag in customEmojis

  return (
    <div className="TopPanel">
      { showEmoji && <Emoji className="emoji" name={selectedTag} customEmojis={customEmojis} /> }
      <h2 className="title">{selectedTag}</h2>
    </div>
  )
}

export default TopPanel
