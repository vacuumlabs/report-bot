import React from 'react'
import ReactEmoji from 'react-emoji-render'
import './Emoji.scss'

function Emoji({name, customEmojis}) {
  const src = customEmojis[name] || name
  return src.startsWith('http') ? (
    <span role='img' className='emoji' style={{backgroundImage: `url("${src}")`}}>
      {name}
    </span>
  ) : <ReactEmoji text={`:${src}:`} />
}

export default Emoji
