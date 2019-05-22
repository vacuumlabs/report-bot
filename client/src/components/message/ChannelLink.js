import React from 'react'
import config from '../../config'
import { Link } from '../ui'

function ChannelLink({ channelId, channelName }) {
  const { workspaceName } = config.slack
  
  return (
    <Link to={`https://${workspaceName}.slack.com/archives/${channelId}`}>#{channelName}</Link>
  )
}

export default ChannelLink
