class StepRule:
    def __init__(self, field: str, operator: str, value: str, outcome: str, message: str):
        self.field = field
        self.operator = operator
        self.value = value
        self.outcome = outcome
        self.message = message

    def evaluate(self, input_data: dict) -> dict | None:
        raw = input_data.get(self.field)
        if raw is None:
            return None
        try:
            a = float(raw)
            b = float(self.value)
            numeric = True
        except (ValueError, TypeError):
            a = str(raw).lower()
            b = str(self.value).lower()
            numeric = False

        matched = False
        if self.operator == "eq":
            matched = a == b
        elif self.operator == "neq":
            matched = a != b
        elif self.operator == "gt" and numeric:
            matched = a > b
        elif self.operator == "gte" and numeric:
            matched = a >= b
        elif self.operator == "lt" and numeric:
            matched = a < b
        elif self.operator == "lte" and numeric:
            matched = a <= b
        elif self.operator == "contains":
            matched = str(b) in str(a)

        return {"outcome": self.outcome, "message": self.message} if matched else None


class Step:
    def __init__(self, name: str, order: int, default_outcome: str = "pass", rules: list = None):
        self.name = name
        self.order = order
        self.default_outcome = default_outcome
        self.rules = rules or []

    def run(self, input_data: dict = None) -> dict:
        input_data = input_data or {}
        for rule in self.rules:
            result = rule.evaluate(input_data)
            if result:
                return {"success": result["outcome"] == "pass", "message": result["message"]}
        success = self.default_outcome == "pass"
        return {"success": success, "message": "Default outcome"}


class Scenario:
    def __init__(self, name: str, steps: list[Step]):
        self.name = name
        self.steps = steps

    def execute(self, input_data: dict = None) -> dict:
        input_data = input_data or {}
        for step in self.steps:
            result = step.run(input_data)
            if not result["success"]:
                return {"success": False, "failed_step": step.name, "reason": result["message"]}
        return {"success": True, "message": f"Scenario '{self.name}' executed successfully."}
