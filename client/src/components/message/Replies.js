import React, { Component } from 'react'
import config from '../../config'
import { normalizeTs } from '../../utils/helpers'
import { getChannelMessageInfo } from '../../utils/slackApi'
import { Link } from '../ui'
import './Replies.scss'

class Replies extends Component {
  constructor() {
    super()
    this.state = {
      firstReplyAuthorPicture: '',
      repliesCount: 0,
    }
  }

  async componentDidMount() {
    const { channel, ts } = this.props

    const messageData = await getChannelMessageInfo(channel, ts)

    this.setState({
      firstReplyAuthorPicture: messageData ? messageData.firstReplyAuthorPicture : '',
      repliesCount: messageData ? messageData.repliesCount : 0,
    })
  }

  render() {
    const { channel, customText, noPicture, ts } = this.props
    const { firstReplyAuthorPicture, repliesCount } = this.state
    const { workspaceName } = config.slack
    const normalizedTs = normalizeTs(ts)

    return (
      <div>
        {!!repliesCount && <div className='Replies'>
          { !noPicture && <img className='replyAuthorPicture' src={firstReplyAuthorPicture} alt="reply author" /> }
          <Link to={`https://${workspaceName}.slack.com/conversation/${channel}/p${normalizedTs}`}>
            { customText || `${ repliesCount } ${ repliesCount === 1 ? 'reply' : 'replies' }` }
          </Link>
        </div>}
      </div>
    )
  }
}

export default Replies
