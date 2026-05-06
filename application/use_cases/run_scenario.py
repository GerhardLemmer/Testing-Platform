from domain.entities.payment_scenarios import PAYMENT_SCENARIOS
from domain.entities.auth_scenarios import AUTH_SCENARIOS
from domain.entities.file_upload_scenarios import FILE_UPLOAD_SCENARIOS
from domain.entities.order_scenarios import ORDER_SCENARIOS
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

def run_auth_scenario(scenario_name: str):
    scenario = AUTH_SCENARIOS.get(scenario_name)
    if scenario is None:
        return {"success": False, "message": f"Scenario '{scenario_name}' not found."}
    result = scenario.execute()
    logger.info(f"Scenario: {scenario.name} | result: {result}")
    return result

def run_file_upload_scenario(scenario_name: str):
    scenario = FILE_UPLOAD_SCENARIOS.get(scenario_name)
    if scenario is None:
        return {"success": False, "message": f"Scenario '{scenario_name}' not found."}
    result = scenario.execute()
    logger.info(f"Scenario: {scenario.name} | result: {result}")
    return result

def run_order_scenario(scenario_name: str):
    scenario = ORDER_SCENARIOS.get(scenario_name)
    if scenario is None:
        return {"success": False, "message": f"Scenario '{scenario_name}' not found."}
    result = scenario.execute()
    logger.info(f"Scenario: {scenario.name} | result: {result}")
    return result