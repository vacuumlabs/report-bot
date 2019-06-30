import React from 'react'
import config from '../../config'
import { Link } from '../ui'
import * as routes from '../../routes'
import MessageContent from './MessageContent'
import './ParentPreview.scss'

function ParentPreview({users, channel, customEmojis, parentTs, parentText, threadTs}) {
  const { workspaceName } = config.slack
  const firstLine = parentText.split('\n')[0]

  return (
    <div className='ParentPreview'>
      <span className='prefix'>
        {'replied to a thread: '}
        <Link to={routes.permalink({channel, ts: parentTs, thread_ts: threadTs})}>
          <MessageContent solid text={firstLine} users={users} customEmojis={customEmojis} />
        </Link>
        &hellip;
      </span>
    </div>
  )
}

export default ParentPreview
