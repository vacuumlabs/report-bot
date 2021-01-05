import React, {Component} from 'react'
import _ from 'lodash'
import TopPanel from '../topPanel/TopPanel'
import MessageList from '../message/MessageList'
import './Content.scss'

class Content extends Component {

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.reports, nextProps.reports)
  }

  render() {
    const {tag, reports, users, channels, emoji, state} = this.props
    return (
      <div className="Content">
        <TopPanel selectedTag={tag} customEmojis={emoji} state={state} />
        <MessageList reports={reports} users={users} channels={channels} customEmojis={emoji} />
      </div>
    )
  }
}

export default Content
