import logging
from sqlalchemy.orm import Session
from infrastructure.repositories.scenario_repository import get_scenario, get_steps, get_scenario_in_domain, save_scenario_run
from domain.entities.scenario import Scenario, Step, StepRule

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def _build_scenario(scenario_record, step_records) -> Scenario:
    steps = []
    for s in sorted(step_records, key=lambda x: x.order):
        rules = [StepRule(r.field, r.operator, r.value, r.outcome, r.message) for r in sorted(s.rules, key=lambda x: x.order)]
        steps.append(Step(s.name, s.order, s.default_outcome, rules))
    return Scenario(name=scenario_record.display_name, steps=steps)

def run_scenario(db: Session, scenario_type: str, scenario_name: str, input_data: dict = None):
    scenario_record = get_scenario(db, scenario_type, scenario_name)
    if scenario_record is None:
        return None
    step_records = get_steps(db, scenario_record.id)
    scenario = _build_scenario(scenario_record, step_records)
    result = scenario.execute(input_data or {})
    logger.info(f"Type: {scenario_type} | Scenario: {scenario_record.display_name} | Result: {result}")
    return result

def run_scenario_in_domain(db: Session, domain_id: str, scenario_type: str, scenario_name: str, input_data: dict = None, user_id: str = None):
    scenario_record = get_scenario_in_domain(db, domain_id, scenario_type, scenario_name)
    if scenario_record is None:
        return None
    step_record = get_steps(db, scenario_record.id)
    scenario = _build_scenario(scenario_record, step_record)
    result = scenario.execute(input_data or {})

    if user_id:
        outcome = "pass" if result["success"] else "fail"
        failed_step = result.get("failed_step")
        save_scenario_run(db, scenario_record.id, user_id, input_data or {}, outcome, failed_step)

    logger.info(f"Domain: {domain_id} | Type: {scenario_type} | Scenario: {scenario_record.display_name} | Result: {result}")
    return result
