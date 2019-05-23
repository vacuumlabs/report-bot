import React from 'react'
import config from '../../config'
import { normalizeTs } from '../../utils/helpers'
import { Link } from '../ui'
import MessageContent from './MessageContent'
import './ParentPreview.scss'

function ParentPreview({ channel, customEmojis, parentTs, parentText, threadTs }) {
  const { workspaceName } = config.slack
  const normalizedTs = normalizeTs(parentTs)
  const firstLine = parentText.split('\n')[0]

  return (
    <div className='ParentPreview'>
      <span className='prefix'>
        {'replied to a thread: '}
        <Link to={`https://${workspaceName}.slack.com/archives/${channel}/p${normalizedTs}?thread_ts=${threadTs}`}>
          <MessageContent solid text={firstLine} customEmojis={customEmojis} />
        </Link>
        &hellip;
      </span>
    </div>
  )
}

export default ParentPreview
