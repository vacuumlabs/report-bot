import React, { Component } from 'react'
import author2 from '../../assets/author2.png'
import { apiCall } from '../../utils/api'
import { formatTs } from '../../utils/helpers'
import { Link } from '../ui'
import MessageContent from './MessageContent'
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
    const { user, channel } = this.props.message

    const [profileData, channelData] = await Promise.all([
      apiCall('users.profile.get', { user }),
      apiCall('channels.info', { channel }),
    ])

    let authorName = ''
    let authorPicture = ''
    let channelName = ''
    
    if (profileData.ok) {
      authorName = profileData.profile.real_name
      authorPicture = profileData.profile.image_32
    }

    if (channelData.ok) {
      channelName = channelData.channel.name
    }

    this.setState({ authorName, authorPicture, channelName })
  }

  render() {
    const { customEmojis, message: { ts, permalink, message: text, response_to }} = this.props
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
          {response_to && <div className="replies">
            <img src={author2} alt="author" />
            <div className="replyCount">1 reply</div>
          </div>}
        </div>
      </div>
    )
  }
}

export default MessageItem
