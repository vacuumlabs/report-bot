import React, { Component } from 'react'
import LeftPanel from './components/leftPanel/LeftPanel'
import TopPanel from './components/topPanel/TopPanel'
import MessageList from './components/message/MessageList'
import { getReportsByTag } from './utils/serverApi'
import './App.scss'

class App extends Component {
  state = {
    emoji: {},
    reports: [],
    selectedTag: null,
  }

  handleSelectTag = async (tag) => {
    const {reports, users, emoji, channels} = await getReportsByTag(tag)

    this.setState({
      selectedTag: tag,
      reports,
      users,
      emoji,
      channels,
    })
  }

  render() {
    const {emoji, reports, users, channels, selectedTag} = this.state

    return (
      <div className="container">
        <LeftPanel onSelectTag={this.handleSelectTag} />
        <div className="content">
          <TopPanel selectedTag={selectedTag} customEmojis={emoji} />
          <MessageList reports={reports} users={users} channels={channels} customEmojis={emoji} />
        </div>  
      </div>
    )
  }
}

export default App
