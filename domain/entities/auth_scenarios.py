from domain.entities.scenario import Scenario, Step

AUTH_SCENARIOS = {
    "success": Scenario(
        name="Authentication Success",
        steps=[
            Step("Validate Input", lambda: {"success": True, "message": "Input is valid"}),
            Step("Check User Exists", lambda: {"success": True, "message": "User found"}),
            Step("Verify Password", lambda: {"success": True, "message": "Password correct"}),
            Step("Check Account Status", lambda: {"success": True, "message": "Account is active"}),
            Step("Generate Token", lambda: {"success": True, "message": "Token generated"}),
        ]
    ),
    "invalid_credentials": Scenario(
        name="Invalid Credentials",
        steps=[
            Step("Validate Input", lambda: {"success": True, "message": "Input is valid"}),
            Step("Check User Exists", lambda: {"success": True, "message": "User found"}),
            Step("Verify Password", lambda: {"success": False, "message": "Password incorrect"}),
            Step("Check Account Status", lambda: {"success": True, "message": "Account is active"}),
            Step("Generate Token", lambda: {"success": True, "message": "Token generated"}),
        ]
    ),
    "account_locked": Scenario(
        name="Account Locked",
        steps=[
            Step("Validate Input", lambda: {"success": True, "message": "Input is valid"}),
            Step("Check User Exists", lambda: {"success": True, "message": "User found"}),
            Step("Verify Password", lambda: {"success": True, "message": "Password correct"}),
            Step("Check Account Status", lambda: {"success": False, "message": "Account is locked due to too many failed attempts"}),
            Step("Generate Token", lambda: {"success": True, "message": "Token generated"}),
        ]
    ),
    "token_expired": Scenario(
        name="Token Expired",
        steps=[
            Step("Validate Input", lambda: {"success": True, "message": "Input is valid"}),
            Step("Check User Exists", lambda: {"success": True, "message": "User found"}),
            Step("Verify Password", lambda: {"success": True, "message": "Password correct"}),
            Step("Check Account Status", lambda: {"success": True, "message": "Account is active"}),
            Step("Generate Token", lambda: {"success": False, "message": "Token has expired, please login again"}),
        ]
    ),
}
