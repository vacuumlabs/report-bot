export const getReportData = async () => {
  const response = await fetch('/api/reports')
  return response.json()
}

export const getTags = async () => {
  const response = await fetch(`/api/tags`)
  return response.json()
}
