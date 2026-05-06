from domain.entities.scenario import Scenario, Step

ORDER_SCENARIOS = {
    "success": Scenario(
        name="Order Success",
        steps=[
            Step("Validate Order", lambda: {"success": True, "message": "Order details are valid"}),
            Step("Check Stock", lambda: {"success": True, "message": "Items are in stock"}),
            Step("Process Payment", lambda: {"success": True, "message": "Payment processed"}),
            Step("Assign Warehouse", lambda: {"success": True, "message": "Warehouse assigned"}),
            Step("Dispatch Order", lambda: {"success": True, "message": "Order dispatched"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Confirmation email sent"}),
        ]
    ),
    "out_of_stock": Scenario(
        name="Out of Stock",
        steps=[
            Step("Validate Order", lambda: {"success": True, "message": "Order details are valid"}),
            Step("Check Stock", lambda: {"success": False, "message": "One or more items are out of stock"}),
            Step("Process Payment", lambda: {"success": True, "message": "Payment processed"}),
            Step("Assign Warehouse", lambda: {"success": True, "message": "Warehouse assigned"}),
            Step("Dispatch Order", lambda: {"success": True, "message": "Order dispatched"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Confirmation email sent"}),
        ]
    ),
    "payment_declined": Scenario(
        name="Payment Declined",
        steps=[
            Step("Validate Order", lambda: {"success": True, "message": "Order details are valid"}),
            Step("Check Stock", lambda: {"success": True, "message": "Items are in stock"}),
            Step("Process Payment", lambda: {"success": False, "message": "Payment declined by provider"}),
            Step("Assign Warehouse", lambda: {"success": True, "message": "Warehouse assigned"}),
            Step("Dispatch Order", lambda: {"success": True, "message": "Order dispatched"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Confirmation email sent"}),
        ]
    ),
    "shipping_failure": Scenario(
        name="Shipping Failure",
        steps=[
            Step("Validate Order", lambda: {"success": True, "message": "Order details are valid"}),
            Step("Check Stock", lambda: {"success": True, "message": "Items are in stock"}),
            Step("Process Payment", lambda: {"success": True, "message": "Payment processed"}),
            Step("Assign Warehouse", lambda: {"success": True, "message": "Warehouse assigned"}),
            Step("Dispatch Order", lambda: {"success": False, "message": "No courier available for delivery address"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Confirmation email sent"}),
        ]
    ),
    "order_cancelled": Scenario(
        name="Order Cancelled",
        steps=[
            Step("Validate Order", lambda: {"success": True, "message": "Order details are valid"}),
            Step("Check Stock", lambda: {"success": True, "message": "Items are in stock"}),
            Step("Process Payment", lambda: {"success": True, "message": "Payment processed"}),
            Step("Assign Warehouse", lambda: {"success": False, "message": "Order cancelled by customer before dispatch"}),
            Step("Dispatch Order", lambda: {"success": True, "message": "Order dispatched"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Confirmation email sent"}),
        ]
    ),
}
