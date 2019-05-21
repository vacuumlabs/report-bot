import React from 'react'
import author from '../../assets/author.png'
import author2 from '../../assets/author2.png'
import './MessageItem.scss'

function MessageItem({message}) {
  const {user: authorName, ts: dateTime, channel, permalink, message: text, response_to } = message
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
            <a href={permalink} target='_blank' rel='noopener noreferrer'>Go to message on Slack</a>
          </div>
        </div>
        <div className="messageTitle">
          <div className="icon">KE</div>
          <div className="messageTitleText">Title</div>
        </div>
        <div className="messageContent">{text}</div>
        {response_to && <div className="replies">
          <img src={author2} alt="author" />
          <div className="replyCount">1 reply</div>
        </div>}
      </div>
    </div>
  )
}

export default MessageItem
