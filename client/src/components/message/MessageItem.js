import React, { Component } from 'react'
import { loadMessageData } from '../../utils/slackApi'
import { Link, Loader } from '../ui'
import MessageContent from './MessageContent'
import ParentPreview from './ParentPreview'
import Replies from './Replies'
import './MessageItem.scss'

class MessageItem extends Component {
  state = {
    messageData: null,
  }

  async componentDidMount() {
    const messageData = await loadMessageData(this.props.message)

    this.setState({
      messageData,
    })
  }

  render() {
    const { customEmojis } = this.props
    const { messageData } = this.state

    if (!messageData) {
      return <Loader size={ 40 } />
    }

    const {
      authorName,
      authorPicture,
      channel,
      channelName,
      dateTime,
      firstReplyAuthorPicture,
      parentText,
      parentTs,
      permalink,
      repliesCount,
      text,
      threadTs,
      ts
    } = messageData

    return (
      <div className="MessageItem">
        <div className="authorPicture">
          <img src={authorPicture} alt="author" />
        </div>
        <div className="messageData">
          <div className="messageInfo">
            <div className="authorName">{authorName}</div>
            <div className="messageDateTimeChannel">{dateTime} in {channelName}</div>
            <div className="messagePermalink">
              <Link to={permalink}>Go to message on Slack</Link>
            </div>
          </div>
          { !!parentTs &&
            <ParentPreview
              channel={channel}
              customEmojis={customEmojis}
              parentTs={parentTs}
              parentText={parentText}
              threadTs={threadTs}
            />
          }
          <MessageContent text={text} customEmojis={customEmojis} />
          {
            parentTs
              ? <Replies channel={channel} customText={'View newer replies'} repliesCount={repliesCount} ts={parentTs} />
              : <Replies channel={channel} firstReplyAuthorPicture={firstReplyAuthorPicture} repliesCount={repliesCount} ts={ts} />
          }
          
        </div>
      </div>
    )
  }
}

export default MessageItem
