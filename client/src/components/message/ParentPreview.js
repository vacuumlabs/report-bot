import React, { Component } from 'react'
import config from '../../config'
import { normalizeTs } from '../../utils/helpers'
import { getChannelMessageInfo } from '../../utils/slackApi'
import { Link } from '../ui'
import MessageContent from './MessageContent'
import './ParentPreview.scss'

class ParentPreview extends Component {
  state = {
    parentMessage: '',
    threadTs: '',
  }

  async componentDidMount() {
    const { channel, ts } = this.props
    const { text, threadTs } = await getChannelMessageInfo(channel, ts)

    this.setState({
      parentMessage: text,
      threadTs,
    })
  }

  render() {
    const { channel, customEmojis, ts } = this.props
    const { parentMessage, threadTs } = this.state
    const { workspaceName } = config.slack
    const firstLine = parentMessage.split('\n')[0]
    const normalizedTs = normalizeTs(ts)

    return (
      <div className='ParentPreview'>
        <span className='prefix'>
          {'replied to a thread: '}
          <Link to={`https://${workspaceName}.slack.com/archives/${channel}/p${normalizedTs}?thread_ts=${threadTs}`}>
            <MessageContent solid text={firstLine} customEmojis={customEmojis} />
          </Link>
          &hellip;
        </span>
      </div>
    )
  }
}

export default ParentPreview
