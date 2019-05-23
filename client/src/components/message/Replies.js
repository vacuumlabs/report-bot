import React, { Component } from 'react'
import config from '../../config'
import { getChannelRepliesInfo } from '../../utils/api'
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

    const repliesData = await getChannelRepliesInfo(channel, ts)

    this.setState({
      firstReplyAuthorPicture: repliesData ? repliesData.firstReplyAuthorPicture : '',
      repliesCount: repliesData ? repliesData.repliesCount : 0,
    })
  }

  render() {
    const { channel, ts } = this.props
    const { firstReplyAuthorPicture, repliesCount } = this.state
    const { workspaceName } = config.slack
    const normalizedTs = ts.replace(/\D/g,'')

    return (
      <div className='Replies'>
        {!!repliesCount && <div className="replies">
          <img className='replyAuthorPicture' src={firstReplyAuthorPicture} alt="reply author" />
          <Link to={`https://${workspaceName}.slack.com/conversation/${channel}/p${normalizedTs}`}>
            {repliesCount} {repliesCount === 1 ? 'reply' : 'replies' }
          </Link>
        </div>}
      </div>
    )
  }
}

export default Replies
