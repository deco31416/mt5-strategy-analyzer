// API client for backend communication
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export async function analyzeAccount(login: string, password: string, server: string) {
  const response = await fetch(`${API_BASE}/analyze?login=${login}&password=${password}&server=${server}`)
  if (!response.ok) {
    throw new Error('Failed to analyze account')
  }
  return response.json()
}

export async function getStrategyTemplate(strategy: string) {
  const response = await fetch(`${API_BASE}/strategy/template?strategy=${encodeURIComponent(strategy)}`)
  if (!response.ok) {
    throw new Error('Failed to get strategy template')
  }
  return response.json()
}

export async function exportStrategy(strategy: string) {
  const response = await fetch(`${API_BASE}/strategy/export?strategy=${encodeURIComponent(strategy)}`)
  if (!response.ok) {
    throw new Error('Failed to export strategy')
  }
  return response.blob()
}