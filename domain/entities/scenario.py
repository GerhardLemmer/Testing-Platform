class Step:
    # This class can be used to define specific steps for a scenario
    def __init__(self, name: str, action):
        self.name = name
        self.action = action
        
    def run(self):
        return self.action()

class Scenario:
    def __init__ (self, name: str, steps: list[Step]):
        self.name = name
        self.steps = steps

    def execute(self):
        for step in self.steps:
            result = step.run()
            if(result["success"] == False):
               return {"success": False, "failed_step": step.name, "reason": result["message"]}
        return {"success": True, "message": f"Scenario {self.name} executed successfully."}
