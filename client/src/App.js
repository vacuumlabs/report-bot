import React, { Component } from 'react'
import LeftPanel from './components/leftPanel/LeftPanel'
import TopPanel from './components/topPanel/TopPanel'
import MessageList from './components/message/MessageList'
import { getReportsByTag } from './utils/serverApi'
import { Loader } from './components/ui'
import './App.scss'

class App extends Component {
  state = {
    emoji: {},
    reports: [],
    selectedTag: null,
    loading: false,
  }

  handleSelectTag = async (tag) => {
    this.setState({
      loading: true,
      selectedTag: tag,
    })

    const {reports, users, emoji, channels} = await getReportsByTag(tag)

    this.setState({
      selectedTag: tag,
      reports,
      users,
      emoji,
      channels,
      loading: false,
    })
  }

  render() {
    const {emoji, reports, users, channels, selectedTag, loading} = this.state

    return (
      <div className="container">
        <LeftPanel onSelectTag={this.handleSelectTag} dataLoading={loading} />
        <div className="content">
          <TopPanel selectedTag={selectedTag} customEmojis={emoji} />
          {
            loading ? <Loader/>:
            <MessageList reports={reports} users={users} channels={channels} customEmojis={emoji} />
          }
        </div>  
      </div>
    )
  }
}

export default App
