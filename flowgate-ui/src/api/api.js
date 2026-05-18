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
export const getScenarios = () => request('/scenarios')
export const getScenarioInputs = (scenarioId) => request(`/scenarios/${scenarioId}/inputs`)
export const runScenario = (scenarioType, scenarioName, domainId) =>
  request(`/scenarios/run/${scenarioType}?scenario_name=${scenarioName}&domain_id=${domainId}`)