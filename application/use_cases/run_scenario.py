import logging
from domain.entities.scenario_registry import get_scenario

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_scenario(scenario_type: str, scenario_name: str):
    scenario = get_scenario(scenario_type, scenario_name)
    if scenario is None:
        return None
    result = scenario.execute()
    logger.info(f"Scenario '{scenario_name}' of type '{scenario_type}' executed with result: {result}")
    return result