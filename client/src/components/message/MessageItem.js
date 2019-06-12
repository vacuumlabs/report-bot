import React, { Component } from 'react'
import {Link} from '../ui'
import MessageContent from './MessageContent'
import ParentPreview from './ParentPreview'
import Replies from './Replies'
import './MessageItem.scss'
import {formatTs} from '../../utils/helpers'

class MessageItem extends Component {

  render() {
    const {message, customEmojis, users, channels} = this.props

    const author = users[message.user]
    const firstReplyAuthor = message.replies.length >= 2 && users[message.replies[1].user]
    const responseTo = message.response_to
    const channelName = channels[message.channel].name
    const dateTime = formatTs(message.ts)

    return (
      <div className="MessageItem">
        <div className="authorPicture">
          <img src={author.image_32} alt="author" />
        </div>
        <div className="messageData">
          <div className="messageInfo">
            <div className="authorName">{author.real_name}</div>
            <div className="messageDateTimeChannel">{dateTime} in {channelName}</div>
            <div className="messagePermalink">
              <Link to={message.permalink}>Go to message on Slack</Link>
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
}

export default MessageItem
