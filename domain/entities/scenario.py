class Step:
   def __init__(self, name: str, success: bool = True, message: str = ""):
         self.name = name
         self.success = success
         self.message = message
   def run(self):
         return {"success": self.success, "message": self.message}

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
