from domain.entities.payment_scenarios import PAYMENT_SCENARIOS

def run_payment_scenario(scenario_name: str):
    scenario = PAYMENT_SCENARIOS.get(scenario_name)
    
    if scenario is None:
        return {"success": False, "message": f"Scenario '{scenario_name}' not found."}
    
    return scenario.execute()