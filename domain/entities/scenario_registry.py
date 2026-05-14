from domain.entities.payment_scenarios import PAYMENT_SCENARIOS

SCENARIO_REGISTRY = {
    "payment": PAYMENT_SCENARIOS,
}

def get_scenario(scenario_type: str, scenario_name: str):
    scenario_group = SCENARIO_REGISTRY.get(scenario_type)
    if scenario_group is None:
        return None
    return scenario_group.get(scenario_name)