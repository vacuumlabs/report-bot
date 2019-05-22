import React from 'react'
import MessageItem from './MessageItem'
import './MessageList.scss'

function MessageList({ customEmojis, reports }) {
  return (
    <div className="MessageList">
      {
        reports.map(report => (<MessageItem key={report.id} message={report} customEmojis={customEmojis} />))
      }
    </div>
  )
}

export default MessageList
