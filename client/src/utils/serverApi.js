import config from '../config'

export const getReportsByTag = async (tag) => {
  const { host, port } = config.server

  const response = await fetch(`${host}:${port}/api/reports-by-tags`, {
    method: 'POST',
    body: JSON.stringify({
      tag
    }),
    headers: {'Content-Type': 'application/json'}
  })

  return response.json()
}

export const getTags = async () => {
  const { host, port } = config.server
  const response = await fetch(`${host}:${port}/api/tags`)
  return response.json()
}
