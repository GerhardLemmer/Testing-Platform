from domain.entities.scenario import Scenario, Step

PAYMENT_SCENARIOS = {
    "success": Scenario(
        name="Payment Success",
        steps=[
            Step("Check Funds", lambda: {"success": True, "message": "Funds available"}),
            Step("Authorize Card", lambda: {"success": True, "message": "Card authorized"}),
            Step("Fraud Check", lambda: {"success": True, "message": "No fraud detected"}),
            Step("Process Payment", lambda: {"success": True, "message": "Payment processed"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Confirmation sent"}),
        ]
    ),
    "insufficient_funds": Scenario(
        name="Insufficient Funds",
        steps=[
            Step("Check Funds", lambda: {"success": False, "message": "Insufficient funds"}),
            Step("Authorize Card", lambda: {"success": True, "message": "Card authorized"}),
            Step("Fraud Check", lambda: {"success": True, "message": "No fraud detected"}),
            Step("Process Payment", lambda: {"success": True, "message": "Payment processed"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Confirmation sent"}),
        ]
    ),
    "auth_failure": Scenario(
        name="Authorization Failure",
        steps=[
            Step("Check Funds", lambda: {"success": True, "message": "Funds available"}),
            Step("Authorize Card", lambda: {"success": False, "message": "Card declined by issuer"}),
            Step("Fraud Check", lambda: {"success": True, "message": "No fraud detected"}),
            Step("Process Payment", lambda: {"success": True, "message": "Payment processed"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Confirmation sent"}),
        ]
    ),
    "fraud_detected": Scenario(
        name="Fraud Detected",
        steps=[
            Step("Check Funds", lambda: {"success": True, "message": "Funds available"}),
            Step("Authorize Card", lambda: {"success": True, "message": "Card authorized"}),
            Step("Fraud Check", lambda: {"success": False, "message": "Transaction flagged as fraudulent"}),
            Step("Process Payment", lambda: {"success": True, "message": "Payment processed"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Confirmation sent"}),
        ]
    ),
}
