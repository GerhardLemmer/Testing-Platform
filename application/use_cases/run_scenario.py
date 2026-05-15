import logging
from sqlalchemy.orm import Session
from infrastructure.scenario_repository import get_scenario, get_steps
from domain.entities.scenario import Scenario, Step

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_scenario(db: Session, scenario_type: str, scenario_name: str):
    scenario_record = get_scenario(db, scenario_type, scenario_name)
    if scenario_record is None:
        return None
    
    step_record = get_steps(db, scenario_record.id)

    steps = [Step(s.name, s.success, s.message) for s in step_record]
    scenario = Scenario(name= scenario_record.display_name, steps=steps)

    result = scenario.execute()
    logger.info(f"Type: {scenario_type} | Scenario: {scenario_record.display_name} | Result: {result}")
    return result

def run_scenario_in_domain(db: Session, domain_id: str, scenario_type: str, scenario_name: str):
    from infrastructure.scenario_repository import get_scenario_in_domain
    scenario_record = get_scenario_in_domain(db, domain_id, scenario_type, scenario_name)
    if scenario_record is None:
        return None

    step_record = get_steps(db, scenario_record.id)
    steps = [Step(s.name, s.success, s.message) for s in step_record]
    scenario = Scenario(name=scenario_record.display_name, steps=steps)

    result = scenario.execute()
    logger.info(f"Domain: {domain_id} | Type: {scenario_type} | Scenario: {scenario_record.display_name} | Result: {result}")
    return result
