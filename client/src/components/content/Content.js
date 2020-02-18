import React, {Component} from 'react'
import TopPanel from '../topPanel/TopPanel'
import MessageList from '../message/MessageList'
import './Content.scss'

class Content extends Component {
  render() {
    const {tag, reports, users, channels, emoji} = this.props
    return (
      <div className="Content">
        <TopPanel selectedTag={tag} customEmojis={emoji} />
        <MessageList reports={reports} users={users} channels={channels} customEmojis={emoji} />
      </div>
    )
  }
}

export default Content
