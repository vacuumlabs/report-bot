import React from 'react'
import { Emoji } from '../ui'
import './TopPanel.scss'

function TopPanel({ customEmojis, selectedTag }) {
  const emojiSpecialName = `__${selectedTag}`
  const showEmoji = emojiSpecialName in customEmojis

  return (
    <div className="TopPanel">
      <h2 className="title">
        { showEmoji && <Emoji className="emoji" name={emojiSpecialName} customEmojis={customEmojis} /> } {selectedTag}
      </h2>
    </div>
  )
}

export default TopPanel
