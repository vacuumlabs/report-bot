import React from 'react'
import author from '../../assets/author.png'
import author2 from '../../assets/author2.png'
import './MessageItem.scss'

function MessageItem({message}) {
  const {authorName, dateTime, channel, permalink, title, iconText, text, replies} = message
  return (
    <div className="MessageItem">
      <div className="authorPicture">
        <img src={author} alt="author" />
      </div>
      <div className="messageData">
        <div className="messageInfo">
          <div className="authorName">{authorName}</div>
          <div className="messageDateTimeChannel">{dateTime} in {channel}</div>
          <div className="messagePermalink">
            <a href={permalink}>Go to message on Slack</a>
          </div>
        </div>
        <div className="messageTitle">
          <div className="icon">{iconText}</div>
          <div className="messageTitleText">{title}</div>
        </div>
        <div className="messageContent">{text}</div>
        {replies && <div className="replies">
          <img src={author2} alt="author" />
          <div className="replyCount">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</div>
        </div>}
      </div>
    </div>
  )
}

export default MessageItem
