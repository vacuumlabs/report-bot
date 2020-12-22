import React, {Component} from 'react'
import {Link} from '../ui'
import MessageContent from './MessageContent'
import ParentPreview from './ParentPreview'
import Replies from './Replies'
import {formatTs} from '../../utils/helpers'
import * as routes from '../../routes'

import './MessageList.scss'

class MessageList extends Component {

  endOfList = React.createRef()

  scrollToBottom = () => {
    this.endOfList.current.scrollIntoView()
  }
  
  componentDidMount() {
    this.scrollToBottom()
  }
  
  componentDidUpdate() {
    this.scrollToBottom()
  }

  render () {
    return (
      <div className="MessageList">
        {this.props.reports.map ((report, i) => (
          <MessageItem
            key={i}
            message={report}
            users={this.props.users}
            channels={this.props.channels}
            customEmojis={this.props.customEmojis}
          />
        ))}
        {/* https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react */}
        <div style={{ float:"left", clear: "both" }} ref={this.endOfList}>
        </div>
      </div>
    )
  }
}


export default MessageList


function MessageItem({message, customEmojis, users, channels}) {
  const author = users[message.user]
  const firstReplyAuthor = message.replies.length >= 2 && users[message.replies[1].user]
  const responseTo = message.response_to
  const channel = channels[message.channel]
  const channelName = channel ? (channel.is_channel ? '#' : '🔒') + channel.name : `#${message.channel}`
  const dateTime = formatTs(message.ts)
  const replyCount = message.replies.length - 1

  return (
    <div className="MessageItem">
      <div className="avatar">
        <img src={author.image_48} srcSet={`${author.image_72} 2x`} alt="User Avatar"/>
      </div>
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
            parentText={message.replies[0].message}
            threadTs={responseTo}
          />
        }
        <MessageContent text={message.message} users={users} customEmojis={customEmojis} />
        {
          replyCount > 0 && (responseTo
            ? <Replies channel={message.channel} customText={'View newer replies'} repliesCount={replyCount} ts={responseTo} />
            : <Replies channel={message.channel} firstReplyAuthorPicture={firstReplyAuthor && firstReplyAuthor.image_32} repliesCount={replyCount} ts={message.ts} />)
        }
        
      </div>
    </div>
  )
}
