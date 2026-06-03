from dataclasses import dataclass
from datetime import datetime

@dataclass
class OrgInvite:
    id: str
    organization_id: str
    invited_email: str
    invited_by: str
    status: str
    created_at: datetime