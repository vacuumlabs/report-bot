import config from '../config'

export const apiCall = async (endpoint, params) => {
  const { apiToken } = config.slack
  const paramsWithToken = { token: apiToken, ...params }
  const queryParams = Object.keys(paramsWithToken).map(key => key + '=' + paramsWithToken[key]).join('&')
  const response = await fetch(`https://slack.com/api/${endpoint}?${queryParams}`)
  const data = await response.json()
  return data
}
