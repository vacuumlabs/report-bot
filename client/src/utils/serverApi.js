export const getReportsByTag = async (tag) => {
  const response = await fetch(`/api/reports-by-tags/${tag}`)
  return response.json()
}

export const getTags = async () => {
  const response = await fetch(`/api/tags`)
  return response.json()
}
