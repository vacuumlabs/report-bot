import React from 'react'
import MessageItem from './MessageItem'
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
