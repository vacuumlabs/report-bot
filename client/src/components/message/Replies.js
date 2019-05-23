import React from 'react'
import config from '../../config'
import { normalizeTs } from '../../utils/helpers'
import { Link } from '../ui'
import './Replies.scss'

function Replies({ channel, customText, firstReplyAuthorPicture, repliesCount, ts }) {
  const { workspaceName } = config.slack
  const normalizedTs = normalizeTs(ts)

  return (
    <div>
      {!!repliesCount && <div className='Replies'>
        { firstReplyAuthorPicture && <img className='replyAuthorPicture' src={firstReplyAuthorPicture} alt="reply author" /> }
        <Link to={`https://${workspaceName}.slack.com/conversation/${channel}/p${normalizedTs}`}>
          { customText || `${ repliesCount } ${ repliesCount === 1 ? 'reply' : 'replies' }` }
        </Link>
      </div>}
    </div>
  )
}

export default Replies
