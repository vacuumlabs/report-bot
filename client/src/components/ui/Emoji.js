import React from 'react'
import ReactEmoji from 'react-emoji-render'
import './Emoji.scss'

function Emoji({ name, customEmojis }) {
  if (customEmojis && name in customEmojis) {
    return (
      <img
        className='customEmoji'
        src={customEmojis[name]}
        alt={name}
      />
    )
  }

  return (
    <ReactEmoji text={`:${name}:`} />
  )
}

export default Emoji
