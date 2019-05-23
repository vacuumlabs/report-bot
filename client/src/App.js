import React, { Component } from 'react'
import LeftPanel from './components/leftPanel/LeftPanel'
import TopPanel from './components/topPanel/TopPanel'
import MessageList from './components/message/MessageList'
import { apiCall } from './utils/api'
import config from './config'
import './App.scss'

class App extends Component {
  constructor() {
    super()
    this.state = {
      customEmojis: {},
      reports: [],
      selectedTag: null
    }
  }

  async componentDidMount() {
    const emojisData = await apiCall('emoji.list')

    if (emojisData.ok) {
      this.setState({ customEmojis: emojisData.emoji })
    }
  }

  handleSelectTag = async (tag) => {
    const { host, port } = config.server

    const response = await fetch(`${host}:${port}/api/reports-by-tags`, {
      method: 'POST',
      body: JSON.stringify({
        tag
      }),
      headers: {'Content-Type': 'application/json'}
    })

    const reports = await response.json()

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
