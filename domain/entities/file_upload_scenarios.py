from domain.entities.scenario import Scenario, Step

FILE_UPLOAD_SCENARIOS = {
    "success": Scenario(
        name="File Upload Success",
        steps=[
            Step("Validate File Type", lambda: {"success": True, "message": "File type is allowed"}),
            Step("Check File Size", lambda: {"success": True, "message": "File size is within limit"}),
            Step("Scan for Viruses", lambda: {"success": True, "message": "No threats detected"}),
            Step("Process File", lambda: {"success": True, "message": "File processed successfully"}),
            Step("Store File", lambda: {"success": True, "message": "File stored successfully"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Upload confirmation sent"}),
        ]
    ),
    "invalid_format": Scenario(
        name="Invalid File Format",
        steps=[
            Step("Validate File Type", lambda: {"success": False, "message": "File type is not allowed"}),
            Step("Check File Size", lambda: {"success": True, "message": "File size is within limit"}),
            Step("Scan for Viruses", lambda: {"success": True, "message": "No threats detected"}),
            Step("Process File", lambda: {"success": True, "message": "File processed successfully"}),
            Step("Store File", lambda: {"success": True, "message": "File stored successfully"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Upload confirmation sent"}),
        ]
    ),
    "file_too_large": Scenario(
        name="File Too Large",
        steps=[
            Step("Validate File Type", lambda: {"success": True, "message": "File type is allowed"}),
            Step("Check File Size", lambda: {"success": False, "message": "File exceeds maximum allowed size"}),
            Step("Scan for Viruses", lambda: {"success": True, "message": "No threats detected"}),
            Step("Process File", lambda: {"success": True, "message": "File processed successfully"}),
            Step("Store File", lambda: {"success": True, "message": "File stored successfully"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Upload confirmation sent"}),
        ]
    ),
    "virus_detected": Scenario(
        name="Virus Detected",
        steps=[
            Step("Validate File Type", lambda: {"success": True, "message": "File type is allowed"}),
            Step("Check File Size", lambda: {"success": True, "message": "File size is within limit"}),
            Step("Scan for Viruses", lambda: {"success": False, "message": "Malicious content detected, upload rejected"}),
            Step("Process File", lambda: {"success": True, "message": "File processed successfully"}),
            Step("Store File", lambda: {"success": True, "message": "File stored successfully"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Upload confirmation sent"}),
        ]
    ),
    "processing_timeout": Scenario(
        name="Processing Timeout",
        steps=[
            Step("Validate File Type", lambda: {"success": True, "message": "File type is allowed"}),
            Step("Check File Size", lambda: {"success": True, "message": "File size is within limit"}),
            Step("Scan for Viruses", lambda: {"success": True, "message": "No threats detected"}),
            Step("Process File", lambda: {"success": False, "message": "File processing timed out"}),
            Step("Store File", lambda: {"success": True, "message": "File stored successfully"}),
            Step("Send Confirmation", lambda: {"success": True, "message": "Upload confirmation sent"}),
        ]
    ),
}
