export const getReportsByTag = async (tag) => {
  const response = await fetch(`/api/reports-by-tags`, {
    method: 'POST',
    body: JSON.stringify({
      tag
    }),
    headers: {'Content-Type': 'application/json'}
  })

  return response.json()
}

export const getTags = async () => {
  const response = await fetch(`/api/tags`)
  return response.json()
}
