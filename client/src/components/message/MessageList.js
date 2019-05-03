import React from 'react'
import MessageItem from './MessageItem'
import './MessageList.scss'

function MessageList({ reports }) {
  return (
    <div className="MessageList">
      {
        reports.map(report => (<MessageItem key={report.id} message={report} />))
      }
    </div>
  )
}

export default MessageList
