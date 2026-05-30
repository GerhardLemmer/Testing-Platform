from sqlalchemy.orm import Session
from infrastructure.repositories.scenario_repository import (
    create_scenario,
    create_step,
    create_step_rule,
    create_scenario_input,
    get_scenario_by_id,
    delete_scenario_steps,
    update_scenario_details,
    delete_scenario as repo_delete_scenario,
)


def create_scenario_with_steps(db: Session, domain_id: str, scenario_type: str, scenario_name: str, display_name: str, steps, inputs):
    scenario = create_scenario(db, domain_id, scenario_type, scenario_name, display_name)
    _persist_steps_and_inputs(db, scenario.id, steps, inputs)
    return scenario


def update_scenario_with_steps(db: Session, scenario_id: str, scenario_type: str, scenario_name: str, display_name: str, steps, inputs):
    update_scenario_details(db, scenario_id, scenario_type, scenario_name, display_name)
    delete_scenario_steps(db, scenario_id)
    scenario = get_scenario_by_id(db, scenario_id)
    _persist_steps_and_inputs(db, scenario.id, steps, inputs)
    return scenario


def remove_scenario(db: Session, scenario_id: str):
    repo_delete_scenario(db, scenario_id)


def _persist_steps_and_inputs(db: Session, scenario_id: str, steps, inputs):
    for step in steps:
        db_step = create_step(db, scenario_id, step.name, step.order, step.default_outcome)
        for rule in step.rules:
            create_step_rule(db, db_step.id, rule.field, rule.operator, rule.value, rule.outcome, rule.message, rule.order)
    for input_field in inputs:
        create_scenario_input(db, scenario_id, input_field.field, input_field.type, input_field.label, input_field.required, input_field.order)
