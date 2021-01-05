import React from 'react'

import { Emoji } from '../ui'
import { tagStateNames } from '../constants'
import { StateIcon } from '../ui/StateIcon'
import './TopPanel.scss'

function TopPanel({ customEmojis, selectedTag, state }) {
  const emojiSpecialName = `__${selectedTag}`
  const showEmoji = emojiSpecialName in customEmojis

  return (
    <div className="TopPanel">
      <h2 className="title">
        { showEmoji && <Emoji className="emoji" name={emojiSpecialName} customEmojis={customEmojis} /> } {selectedTag}
      </h2>
      <div className="stateIcon">
        <StateIcon state={state} />
      </div>
      <h2>
        {tagStateNames[state]}
      </h2>
    </div>
  )
}

export default TopPanel
