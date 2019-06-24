import React, { Component } from 'react'
import TopPanel from '../topPanel/TopPanel'
import MessageList from '../message/MessageList'
import { getReportsByTag } from '../../utils/serverApi'
import './Content.scss'

class Content extends Component {
  state = {
    emoji: {},
    reports: [],
    selectedTag: null,
  }

  componentWillReceiveProps(nextProps) {
    this.createState(nextProps)
  }

  componentWillMount() {
    this.createState()
  }

  createState = async (props = this.props) => {
    const { tag } = props.match.params
    const selectedTag = decodeURI(tag)

    const {reports, users, emoji, channels} = await getReportsByTag(selectedTag)
    
    this.setState({
      reports,
      users,
      emoji,
      channels,
      selectedTag,
    })
  }

  render() {
    const {emoji, reports, users, channels, selectedTag} = this.state

    return (
      <div className="Content">
        <TopPanel selectedTag={selectedTag} customEmojis={emoji} />
        <MessageList reports={reports} users={users} channels={channels} customEmojis={emoji} />
      </div>
    )
  }
}

export default Content
