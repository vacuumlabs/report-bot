import React, { Component } from 'react'
import { getChannelName, getUserInfo } from '../../utils/api'
import { formatTs } from '../../utils/helpers'
import { Link } from '../ui'
import MessageContent from './MessageContent'
import Replies from './Replies'
import './MessageItem.scss'

class MessageItem extends Component {
  constructor() {
    super()
    this.state = {
      authorName: '',
      authorPicture: '',
      channelName: '',
    }
  }

  async componentDidMount() {
    const { channel, user } = this.props.message

    const [userInfo, channelName] = await Promise.all([
      getUserInfo(user),
      getChannelName(channel),
    ])
    
    this.setState({
      authorName: userInfo ? userInfo.userName : '',
      authorPicture: userInfo ? userInfo.userPicture : '',
      channelName,
    })
  }

  render() {
    const { customEmojis, message: { channel, ts, permalink, message: text, response_to }} = this.props
    const { authorName, authorPicture, channelName } = this.state
    const dateTime = formatTs(ts)

    return (
      <div className="MessageItem">
        <div className="authorPicture">
          <img src={authorPicture} alt="author" />
        </div>
        <div className="messageData">
          <div className="messageInfo">
            <div className="authorName">{authorName}</div>
            <div className="messageDateTimeChannel">{dateTime} in {channelName}</div>
            <div className="messagePermalink">
              <Link to={permalink}>Go to message on Slack</Link>
            </div>
          </div>
          <MessageContent text={text} customEmojis={customEmojis} />
          <Replies channel={channel} ts={ts} />
        </div>
      </div>
    )
  }
}

export default MessageItem
