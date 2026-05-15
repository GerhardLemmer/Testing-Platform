import uuid 
from sqlalchemy.orm import Session
from domain.entities.models import ScenarioModel, StepModel, User, Organization, OrganizationMember

def get_scenario(db: Session, scenario_type: str, scenario_name: str):
    return db.query(ScenarioModel).filter(
        ScenarioModel.scenario_type == scenario_type,
        ScenarioModel.scenario_name == scenario_name
    ).first()

def get_steps(db: Session, scenario_id: str):
    return db.query(StepModel).filter(
        StepModel.scenario_id == scenario_id
    ).all()

def create_scenario(db: Session, scenario_type: str, scenario_name: str, display_name: str):
    scenario = ScenarioModel(
        id = str(uuid.uuid4()),
        scenario_type = scenario_type,
        scenario_name = scenario_name,
        display_name = display_name
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return scenario

def create_step(db: Session, scenario_id: str, name: str, success: bool, message: str, order: int):
    step = StepModel(
        id = str(uuid.uuid4()),
        scenario_id = scenario_id,
        name = name,
        success = success,
        message = message,
        order = order
    )
    db.add(step)
    db.commit()
    db.refresh(step)
    return step

def get_all_scenarios(db:Session):
    return db.query(ScenarioModel).all()

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