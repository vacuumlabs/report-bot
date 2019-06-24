import React, { Component } from 'react'
import TopPanel from '../topPanel/TopPanel'
import MessageList from '../message/MessageList'
import { Loader } from '../ui'
import { getReportsByTag } from '../../utils/serverApi'
import './Content.scss'

class Content extends Component {
  state = {
    emoji: {},
    reports: [],
    loading: true,
  }

  componentWillReceiveProps(nextProps) {
    this.createState(nextProps)
  }

  componentWillMount() {
    this.createState()
  }

  createState = async (props = this.props) => {
    this.setState({
      loading: true
    })

    const { tag } = props.match.params
    let selectedTag = tag || props.defaultTag
    selectedTag = selectedTag ? decodeURI(selectedTag) : selectedTag

    const {reports, users, emoji, channels} = await getReportsByTag(selectedTag)
    
    this.setState({
      reports,
      users,
      emoji,
      channels,
      selectedTag,
      loading: props.loading,
    })
  }

  render() {
    const {emoji, reports, users, channels, selectedTag, loading} = this.state

    return (
      <div className="Content">
        {loading && 
          <div className="info">
            <Loader />
          </div>
        }
        {!loading && !selectedTag &&
          <div className="info">
            No messages.
          </div>
        }
        {!loading && selectedTag &&
          <>
            <TopPanel selectedTag={selectedTag} customEmojis={emoji} />
            <MessageList reports={reports} users={users} channels={channels} customEmojis={emoji} />
          </>
        }
      </div>
    )
  }
}

export default Content
