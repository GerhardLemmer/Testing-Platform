from domain.entities.payment_scenarios import PAYMENT_SCENARIOS
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_payment_scenario(scenario_name: str):
    scenario = PAYMENT_SCENARIOS.get(scenario_name)
    if scenario is None:
        return {"success": False, "message": f"Scenario '{scenario_name}' not found."}
    result = scenario.execute()
    logger.info(f"Scenario: {scenario.name} | result: {result}")
    return result