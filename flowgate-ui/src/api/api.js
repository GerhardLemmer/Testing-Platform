const BASE_URL = '/api'

async function request(path, options = {}) {
    const keycloak = (await(import('../keycloak'))).default
    await keycloak.updateToken(30)
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
export const runScenario = (scenarioType, scenarioName, domainId, inputData) => request('/scenarios/run', {method: 'POST', body: JSON.stringify({ scenario_type: scenarioType, scenario_name: scenarioName, domain_id: domainId, input_data: inputData })})
export const getOrganizations = () => request('/organizations')
export const createOrganization = (name) => request('/organizations', { method: 'POST', body: JSON.stringify({ name }) })
export const createDomain = (name, organization_id = null) => request('/domains', {method: 'POST', body: JSON.stringify({name, organization_id})})
export const createScenario = (payload) => request('/scenarios', {method: 'POST', body: JSON.stringify(payload)})
export const getScenarioById = (scenarioId) => request(`/scenarios/${scenarioId}`)
export const updateScenario = (scenarioId, payload) => request(`/scenarios/${scenarioId}`, {method: 'PUT', body: JSON.stringify(payload)})
export const getScenarioRuns = (scenarioId) => request(`/scenarios/${scenarioId}/runs`)
export const sendInvite = (orgId, invitedEmail) => request(`/organizations/${orgId}/invites`, { method: 'POST', body: JSON.stringify({ organization_id: orgId, invited_email: invitedEmail }) })
export const getInvites = () => request('/invites')
export const respondToInvite = (inviteId, status) => request(`/invites/${inviteId}`, { method: 'PUT', body: JSON.stringify({ status }) })