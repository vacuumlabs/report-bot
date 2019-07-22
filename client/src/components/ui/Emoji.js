import React from 'react'
import emojiData from 'emoji-datasource/emoji.json'
import punycode from 'punycode'
import './Emoji.scss'

function name2unicode(str) {
  const record = emojiData.find((e) => e.short_name === str)
  if (record == null) return str

  return punycode.ucs2.encode(
    record.unified
      .split('-')
      .map((p) => parseInt(p, 16))
  )
}

function Emoji({name, customEmojis}) {
  const src = customEmojis[name] || name
  return src.startsWith('http') ? (
    <span role='img' className='emoji' style={{backgroundImage: `url("${src}")`}}>
      {name}
    </span>
  ) : name2unicode(src)
}

export default Emoji
