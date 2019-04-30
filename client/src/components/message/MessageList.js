import React from 'react'
import MessageItem from './MessageItem'
import './MessageList.scss'

function MessageList() {
  const mockMessages = [
    {
      id: 1,
      authorName: 'Amy Rogers',
      dateTime: 'August 5th, 1:54 PM',
      channel: '#hq-reports',
      permalink: '#',
      title: 'Corpo structure',
      iconText: 'KE',
      text: `Kogi Cosby sweater ethical squid irony disrupt, organic tote bag gluten-free XOXO wolf typewritter mixtape small batch.
        DIY pickled four loko McSweeney's, Odd Future dreamcatcher paid. PBR&amp;B single-origin coffee gluten-free McSweeney's banjo,
        bicycle rights food truck gastropub vinyl.`,
      replies: [
        { text: "reply" },
        { text: "reply" }
      ]
    },
    {
      id: 2,
      authorName: 'Sam Hapák',
      dateTime: 'August 5th, 1:54 PM',
      channel: '#hq-reports',
      permalink: '#',
      title: 'Košice office update',
      iconText: 'KE',
      text: `Kogi Cosby sweater ethical squid irony disrupt, organic tote bag gluten-free XOXO wolf typewritter mixtape small batch.
        DIY pickled four loko McSweeney's, Odd Future dreamcatcher paid. PBR&amp;B single-origin coffee gluten-free McSweeney's banjo,
        bicycle rights food truck gastropub vinyl.`,
    },
    {
      id: 3,
      authorName: 'Amy Rogers',
      dateTime: 'August 5th, 1:54 PM',
      channel: '#hq-reports',
      permalink: '#',
      title: 'Corpo structure',
      iconText: 'KE',
      text: `Kogi Cosby sweater ethical squid irony disrupt, organic tote bag gluten-free XOXO wolf typewritter mixtape small batch.
        DIY pickled four loko McSweeney's, Odd Future dreamcatcher paid. PBR&amp;B single-origin coffee gluten-free McSweeney's banjo,
        bicycle rights food truck gastropub vinyl.`,
      replies: [
        { text: "reply" }
      ]
    }
  ]
  return (
    <div className="MessageList">
      {
        mockMessages.map(message => (<MessageItem key={message.id} message={message} />))
      }
    </div>
  )
}

export default MessageList
