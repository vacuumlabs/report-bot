import moment from 'moment'

export const normalizeTs = (ts) => {
  return ts.replace(/\D/g,'')
}

export const formatTs = (ts) => {
  const parsedTimestamp = moment(parseInt(ts, 10) * 1000)
  return parsedTimestamp.year() === moment().year() ? parsedTimestamp.format("MMMM Do, h:mm A") : parsedTimestamp.format("MMMM Do YYYY, h:mm A")
}
