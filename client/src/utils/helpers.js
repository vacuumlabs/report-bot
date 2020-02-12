import moment from 'moment'

export const parseTs = (ts) => {
  return moment(parseInt(ts, 10) * 1000)
}

export const formatTs = (ts) => {
  const parsedTimestamp = parseTs(ts)
  return parsedTimestamp.year() === moment().year() ? parsedTimestamp.format("MMMM Do, h:mm A") : parsedTimestamp.format("MMMM Do YYYY, h:mm A")
}
