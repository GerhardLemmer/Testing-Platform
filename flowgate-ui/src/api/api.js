const BASE_URL = '/api'

async function request(path, options = {}) {
    const keycloak = (await(import('../keycloak'))).default
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${keycloak.token}`,
            ...options.headers
        }
    })
    if(!response.ok) throw new Error(`Request failed: ${response.status}`)
    return response.json()
}

export const getDomains = () => request('/domains')
export const getScenarios = (domainId) => request(`/scenarios?domain_id=${domainId}`)
export const getScenarioInputs = (scenarioId) => request(`/scenarios/${scenarioId}/inputs`)
export const runScenario = (scenarioType, scenarioName, domainId, inputData = {}) => {
  const params = new URLSearchParams({ scenario_name: scenarioName, domain_id: domainId, ...inputData })
  return request(`/scenarios/run/${scenarioType}?${params}`)
}
export const getOrganizations = () => request('/organizations')
export const createDomain = (name, orginization_id = null) => request('/domains', {method: 'POST', body: JSON.stringify({name, orginization_id})})