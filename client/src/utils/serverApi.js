export const getReportData = async () => {
  const response = await fetch('/api/reports')
  return response.json()
}

export const getTags = async () => {
  const response = await fetch(`/api/tags`)
  return response.json()
}


export const updateTag = async (data) => {
  const response = await fetch(`/api/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return response.json()
}

export const getPortfolios = async () => {
  const response = await fetch(`/api/portfolios`)
  return response.json()
}

export const createPortfolio = async (data) => {
  const response = await fetch(`/api/portfolios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return response.json()
}

export const deletePortfolio = async (name) => {
  const response = await fetch(`/api/portfolios/${name}`, {
    method: 'DELETE'
  })

  return response.json()
}

