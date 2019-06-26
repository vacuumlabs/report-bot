import config from '../config'

export const getChannelLink = (channelId) => {
  const { workspaceName } = config.slack
  return `https://${workspaceName}.slack.com/archives/${channelId}`
}

export const getUserLink = (userId) => {
  const { workspaceName } = config.slack
  return `https://${workspaceName}.slack.com/team/${userId}`
}
