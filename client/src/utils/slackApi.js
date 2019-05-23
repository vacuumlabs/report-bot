import config from '../config'
import { formatTs } from './helpers'

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

export const getChannelMessageInfo = async (channel, ts) => {
  const repliesData = await apiCall('channels.replies', { channel, thread_ts: ts })

  if (!repliesData.ok) {
    return
  }

  const { messages } = repliesData
  
  if (!messages || !messages.length || !messages[0].replies) {
    return
  }

  const { replies, text, thread_ts: threadTs } = messages[0]
  const firstReplyUserInfo = await getUserInfo(replies[0].user)

  return {
    firstReplyAuthorPicture: firstReplyUserInfo.userPicture,
    repliesCount: replies.length,
    text,
    threadTs,
  }
}

export const getCustomEmojis = async () => {
  const emojisData = await apiCall('emoji.list')

  if (!emojisData.ok) {
    return []
  }

  return emojisData.emoji
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

export const loadMessageData = async (report) => {
  const { channel, message: text, permalink, response_to: parentTs, ts, user } = report

  const [userInfo, channelName, messageInfo] = await Promise.all([
    getUserInfo(user),
    getChannelName(channel),
    getChannelMessageInfo(channel, parentTs || ts),
  ])

  return {
    authorName: userInfo ? userInfo.userName : '',
    authorPicture: userInfo ? userInfo.userPicture : '',
    channel,
    channelName,
    dateTime: formatTs(ts),
    firstReplyAuthorPicture: messageInfo ? messageInfo.firstReplyAuthorPicture : '',
    parentText: parentTs ? messageInfo.text : '',
    parentTs,
    permalink,
    repliesCount: messageInfo ? messageInfo.repliesCount : 0,
    text,
    threadTs: parentTs ? messageInfo.threadTs : '',
    ts,
  }
}
