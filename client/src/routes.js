import config from './config'

// Reverse engineered from slack source code:
// return ["slack://channel", "?id=" + t.id, "&message=" + r.ts, "&team=" + Object(c["b"])(e), r.thread_ts ? "&thread_ts=" + r.thread_ts : ""].join("")
export const permalink = ({channel, ts, thread_ts}) =>
  `slack://channel?team=${config.slack.team}&id=${channel}&message=${ts}`
    + (thread_ts ? `&thread_ts=${thread_ts}` : '')

export const channel = (channel) =>
  `slack://channel?team=${config.slack.team}&id=${channel}`

export const user = (user) =>
  `slack://user?team=${config.slack.team}&id=${user}`
