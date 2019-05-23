import React, { Component } from 'react'
import LeftPanel from './components/leftPanel/LeftPanel'
import TopPanel from './components/topPanel/TopPanel'
import MessageList from './components/message/MessageList'
import { getReportsByTag } from './utils/serverApi'
import { getCustomEmojis } from './utils/slackApi'
import './App.scss'

class App extends Component {
  state = {
    customEmojis: {},
    reports: [],
    selectedTag: null,
  }

  async componentDidMount() {
    const customEmojis = await getCustomEmojis()

    this.setState({
      customEmojis,
    })
  }

  handleSelectTag = async (tag) => {
    const reports = await getReportsByTag(tag)

    this.setState({
      selectedTag: tag,
      reports
    })
  }

  render() {
    const { customEmojis, reports, selectedTag } = this.state

    return (
      <div className="container">
        <LeftPanel onSelectTag={ this.handleSelectTag } />
        <div className="content">
          <TopPanel selectedTag={ selectedTag } customEmojis={ customEmojis } />
          <MessageList reports={ reports } customEmojis={ customEmojis } />
        </div>  
      </div>
    )
  }
}

export default App
