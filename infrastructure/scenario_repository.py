import uuid 
from sqlalchemy.orm import Session
from domain.entities.models import ScenarioModel, StepModel, StepRule, ScenarioRun, User, Organization, OrganizationMember, Domain, ScenarioInput
from datetime import datetime,timezone

def get_scenario(db: Session, scenario_type: str, scenario_name: str):
    return db.query(ScenarioModel).filter(
        ScenarioModel.scenario_type == scenario_type,
        ScenarioModel.scenario_name == scenario_name
    ).first()

def get_steps(db: Session, scenario_id: str):
    return db.query(StepModel).filter(
        StepModel.scenario_id == scenario_id
    ).all()

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

def get_scenarios_for_user(db: Session, user_id: str):
    return db.query(ScenarioModel).join(Domain).filter(Domain.user_id == user_id).all()

def get_user_by_email(db: Session, email:str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str, hashed_password: str, full_name: str):
    user = User(
        id= str(uuid.uuid4()),
        email= email,
        hashed_password= hashed_password,
        full_name= full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_organization(db: Session, name: str, owner_id: str):
    org = Organization(
        id = str(uuid.uuid4()),
        name = name,
        owner_id = owner_id
    )
    db.add(org)
    db.commit()
    db.refresh(org)
    return org

def get_organization_by_name(db: Session, name: str):
    return db.query(Organization).filter(Organization.name == name).first()

def get_organization_by_id(db: Session, org_id: str):
    return db.query(Organization).filter(Organization.id == org_id).first()

def add_organization_member(db: Session, org_id: str, user_id: str, role: str):
    member = OrganizationMember(
        id = str(uuid.uuid4()),
        organization_id = org_id,
        user_id = user_id,
        role = role
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

def get_organization_member(db: Session, org_id: str, user_id: str):
    return db.query(OrganizationMember).filter(OrganizationMember.organization_id == org_id, OrganizationMember.user_id == user_id).first()

def create_domain(db: Session, name: str, user_id: str = None, organization_id: str = None):
    domain = Domain(
        id = str(uuid.uuid4()),
        name = name,
        user_id = user_id,
        organization_id = organization_id
    )
    db.add(domain)
    db.commit()
    db.refresh(domain)
    return domain

def get_domains_for_user(db: Session, user_id: str):
    return db.query(Domain).filter(Domain.user_id == user_id).all()

def get_org_domains_for_user(db: Session, user_id: str):
    return (
        db.query(Domain)
        .join(OrganizationMember, OrganizationMember.organization_id == Domain.organization_id)
        .filter(OrganizationMember.user_id == user_id)
        .all()
    )

def get_domain_by_id(db: Session, domain_id: str):
    return db.query(Domain).filter(Domain.id == domain_id).first()

def get_scenario_in_domain(db: Session, domain_id: str, scenario_type: str, scenario_name: str):
    return db.query(ScenarioModel).filter(
        ScenarioModel.domain_id == domain_id,
        ScenarioModel.scenario_type == scenario_type,
        ScenarioModel.scenario_name == scenario_name
    ).first()

def save_scenario_run(db: Session, scenario_id: str, triggered_by: str, input_data: dict, outcome: str, failed_step: str = None):
    run = ScenarioModel(
        id = str(uuid.uuid4()),
        scenario_id = scenario_id,
        triggered_by = triggered_by,
        input_data = input_data,
        outcome = outcome,
        failed_step = failed_step,
        created_at = datetime.now(timezone.utc)
    )
    db.add(run)
    db.commit()
    return run

def create_scenario_input(db: Session, scenario_id: str, field: str, type: str, label: str, required: bool = True, order: int = 0):
    input = ScenarioInput(
        id = str(uuid.uuid4()),
        scenario_id = scenario_id,
        field = field,
        type = type,
        label = label,
        required = required,
        order = order
    )
    db.add(input)
    db.commit()
    db.refresh(input)
    return input

def get_scenario_inputs(db: Session, scenario_id: str):
    return db.query(ScenarioInput).filter(ScenarioInput.scenario_id == scenario_id).order_by(ScenarioInput.order).all()