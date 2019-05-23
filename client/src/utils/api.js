import config from '../config'

export const apiCall = async (endpoint, params) => {
  const { apiToken } = config.slack
  const paramsWithToken = { token: apiToken, ...params }
  const queryParams = Object.keys(paramsWithToken).map(key => key + '=' + paramsWithToken[key]).join('&')
  const response = await fetch(`https://slack.com/api/${endpoint}?${queryParams}`)
  const data = await response.json()
  return data
}

export const getChannelName = async (channel) => {
  const channelData = await  apiCall('channels.info', { channel })

  if (!channelData.ok) {
    return ''
  }

  return channelData.channel.name
}

export const getChannelRepliesInfo = async (channel, ts) => {
  const repliesData = await apiCall('channels.replies', { channel, thread_ts: ts })

  if (!repliesData.ok) {
    return
  }

  const { messages } = repliesData
  
  if (!messages || !messages.length || !messages[0].replies) {
    return
  }

  const { replies } = messages[0]
  const firstReplyUserInfo = await getUserInfo(replies[0].user)

  return {
    repliesCount: replies.length,
    firstReplyAuthorPicture: firstReplyUserInfo.userPicture
  }
}

export const getUserInfo = async (user) => {
  const profileData = await apiCall('users.profile.get', { user })

  if (!profileData.ok) {
    return
  }

  return {
    userName: profileData.profile.real_name,
    userPicture: profileData.profile.image_32,
  }
}
