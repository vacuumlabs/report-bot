import React from 'react'
import {Link} from '../ui'
import MessageContent from './MessageContent'
import ParentPreview from './ParentPreview'
import Replies from './Replies'
import {formatTs} from '../../utils/helpers'
import * as routes from '../../routes'

import './MessageList.scss'

function MessageList({customEmojis, reports, users, channels}) {
  return (
    <div className="MessageList">
      {
        reports.map(report => (<MessageItem key={report.id} message={report} users={users} channels={channels} customEmojis={customEmojis} />))
      }
    </div>
  )
}

export default MessageList


function MessageItem({message, customEmojis, users, channels}) {
  const author = users[message.user]
  const firstReplyAuthor = message.replies.length >= 2 && users[message.replies[1].user]
  const responseTo = message.response_to
  const channel = channels[message.channel]
  const channelName = (channel.is_channel ? '#' : '🔒') + channel.name
  const dateTime = formatTs(message.ts)

  return (
    <div className="MessageItem">
      <a className="avatar">
        <img src={author.image_48} srcSet={`${author.image_72} 2x`} />
      </a>
      <div className="messageData">
        <div className="messageInfo">
          <div className="authorName">{author.real_name}</div>
          <div className="messageDateTimeChannel">{dateTime} in {channelName}</div>
          <div className="messagePermalink">
            <Link to={routes.permalink(message)}>Go to message on Slack</Link>
          </div>
        </div>
        { !!responseTo &&
          <ParentPreview
            users={users}
            channel={message.channel}
            customEmojis={customEmojis}
            parentTs={responseTo}
            parentText={message.replies[0].text}
            threadTs={responseTo}
          />
        }
        <MessageContent text={message.message} users={users} customEmojis={customEmojis} />
        {
          responseTo
            ? <Replies channel={message.channel} customText={'View newer replies'} repliesCount={message.replies.length} ts={responseTo} />
            : <Replies channel={message.channel} firstReplyAuthorPicture={firstReplyAuthor && firstReplyAuthor.image_32} repliesCount={message.replies.length} ts={message.ts} />
        }
        
      </div>
    </div>
  )
}
