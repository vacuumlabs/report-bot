import React from 'react'
import config from '../../config'
import * as routes from '../../routes'
import { Link } from '../ui'
import './Replies.scss'

function Replies({ channel, customText, firstReplyAuthorPicture, repliesCount, ts }) {
  const { workspaceName } = config.slack

  return (
    <div>
      {!!repliesCount && <div className='Replies'>
        { firstReplyAuthorPicture && <img className='replyAuthorPicture' src={firstReplyAuthorPicture} alt="reply author" /> }
        <Link to={routes.permalink({channel, ts, thread_ts: ts})}>
          { customText || `${ repliesCount } ${ repliesCount === 1 ? 'reply' : 'replies' }` }
        </Link>
      </div>}
    </div>
  )
}

export default Replies
