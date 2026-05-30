import uuid
from sqlalchemy.orm import Session
from infrastructure.models import ScenarioModel, StepModel, StepRule, ScenarioRun, ScenarioInput
from datetime import datetime, timezone


def get_scenario(db: Session, scenario_type: str, scenario_name: str):
    return db.query(ScenarioModel).filter(
        ScenarioModel.scenario_type == scenario_type,
        ScenarioModel.scenario_name == scenario_name
    ).first()

def get_scenario_in_domain(db: Session, domain_id: str, scenario_type: str, scenario_name: str):
    return db.query(ScenarioModel).filter(
        ScenarioModel.domain_id == domain_id,
        ScenarioModel.scenario_type == scenario_type,
        ScenarioModel.scenario_name == scenario_name
    ).first()

def get_scenarios_for_domain(db: Session, domain_id: str):
    return db.query(ScenarioModel).filter(ScenarioModel.domain_id == domain_id).all()

def create_scenario(db: Session, domain_id: str, scenario_type: str, scenario_name: str, display_name: str):
    scenario = ScenarioModel(
        id=str(uuid.uuid4()),
        domain_id=domain_id,
        scenario_type=scenario_type,
        scenario_name=scenario_name,
        display_name=display_name
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return scenario

def get_steps(db: Session, scenario_id: str):
    return db.query(StepModel).filter(StepModel.scenario_id == scenario_id).all()

def create_step(db: Session, scenario_id: str, name: str, order: int, default_outcome: str = "pass"):
    step = StepModel(
        id=str(uuid.uuid4()),
        scenario_id=scenario_id,
        name=name,
        order=order,
        default_outcome=default_outcome
    )
    db.add(step)
    db.commit()
    db.refresh(step)
    return step

def create_step_rule(db: Session, step_id: str, field: str, operator: str, value: str, outcome: str, message: str, order: int = 0):
    rule = StepRule(
        id=str(uuid.uuid4()),
        step_id=step_id,
        field=field,
        operator=operator,
        value=value,
        outcome=outcome,
        message=message,
        order=order
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule

def save_scenario_run(db: Session, scenario_id: str, triggered_by: str, input_data: dict, outcome: str, failed_step: str = None):
    run = ScenarioRun(
        id=str(uuid.uuid4()),
        scenario_id=scenario_id,
        triggered_by=triggered_by,
        input_data=input_data,
        outcome=outcome,
        failed_step=failed_step,
        created_at=datetime.now(timezone.utc)
    )
    db.add(run)
    db.commit()
    return run

def create_scenario_input(db: Session, scenario_id: str, field: str, type: str, label: str, required: bool = True, order: int = 0):
    input_field = ScenarioInput(
        id=str(uuid.uuid4()),
        scenario_id=scenario_id,
        field=field,
        type=type,
        label=label,
        required=required,
        order=order
    )
    db.add(input_field)
    db.commit()
    db.refresh(input_field)
    return input_field

def get_scenario_inputs(db: Session, scenario_id: str):
    return (
        db.query(ScenarioInput)
        .filter(ScenarioInput.scenario_id == scenario_id)
        .order_by(ScenarioInput.order)
        .all()
    )

def get_scenario_runs(db: Session, scenario_id: str):
    return(
        db.query(ScenarioRun)
        .filter(ScenarioRun.scenario_id == scenario_id)
        .order_by(ScenarioRun.created_at.desc())
        .all()
    )

def get_scenario_by_id(db: Session, scenario_id: str):
    return(
        db.query(ScenarioModel)
        .filter(ScenarioModel.id == scenario_id)
        .first()
    )

def delete_scenario_steps(db: Session, scenario_id: str):
    steps = db.query(StepModel).filter(StepModel.scenario_id == scenario_id).all()
    for step in steps:
        db.query(StepRule).filter(StepRule.step_id == step.id).delete()
    db.query(StepModel).filter(StepModel.scenario_id == scenario_id).delete()
    db.query(ScenarioInput).filter(ScenarioInput.scenario_id == scenario_id).delete()
    db.commit()

def update_scenario_details(db: Session, scenario_id: str, scenario_type: str, scenario_name: str, display_name: str):
    scenario = db.query(ScenarioModel).filter(ScenarioModel.id == scenario_id).first()
    scenario.scenario_type = scenario_type
    scenario.scenario_name = scenario_name
    scenario.display_name = display_name
    db.commit()
    db.refresh(scenario)
    return scenario

def delete_scenario(db: Session, scenario_id: str):
    steps = db.query(StepModel).filter(StepModel.scenario_id == scenario_id).all()
    for step in steps:
        db.query(StepRule).filter(StepRule.step_id == step.id).delete()
    db.query(StepModel).filter(StepModel.scenario_id == scenario_id).delete()
    db.query(ScenarioInput).filter(ScenarioInput.scenario_id == scenario_id).delete()
    db.query(ScenarioRun).filter(ScenarioRun.scenario_id == scenario_id).delete()
    db.query(ScenarioModel).filter(ScenarioModel.id == scenario_id).delete()
    db.commit()