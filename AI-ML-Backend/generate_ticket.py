import json
import logging
import uuid
# from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def generate_ticket(
    query_id=None,
    query_type=None,
    branch_id=None,
    query_level=None,
    role_level=None,
    branch_level=None,
    role_name=None,  # Added this
    department=None,
    service_type=None,
    request_category=None,
    transcribed_text=None,
    translated_query=None,
    detected_language=None,
    priority=None,
    success=True,
    error_message=None
):

    """
    Generate a flattened JSON ticket combining all data.
    
    Args:
        query_id (str): Unique identifier for the query
        query_type (str): Type of query ('text', 'video_url', 'combined', 'predefined')
        branch_id (str): ID of the branch where the query was raised
        query_level (str): Level of the query ('branch' or 'central')
        status (str): Deprecated - kept for backward compatibility
        department (str): Main department of the query
        service_type (str): service_type of the query
        request_category (str): request_category of the query
        transcribed_text (str): Text content of the query
        translated_query (str): Translated query text (if not in English)
        detected_language (str): Detected language of the query
        priority (str): Priority level ('low', 'medium', 'high', 'critical')
        urgency (str): Deprecated - kept for backward compatibility
        success (bool): Whether the ticket was successfully processed
        error_message (str): Error message if success is False
    
    Returns:
        dict: Flattened JSON ticket
    """
    try:
        # Generate a query_id if not provided
        if not query_id:
            query_id = str(uuid.uuid4())
        
        # Set default values for missing fields
        if not query_type:
            query_type = "text"
        
        if not branch_id:
            branch_id = "unknown"
        
        if not query_level:
            query_level = "branch"
        
        if not department:
            department = "General Inquiry"
        
        if not service_type:
            service_type = "Services"
        
        if not request_category:
            request_category = "Process"
        
        if not transcribed_text:
            transcribed_text = ""
        
        if not translated_query:
            translated_query = ""
        
        if not detected_language:
            detected_language = "en"
        
        if not priority:
            priority = "medium"
        
        if not success:
            success = False
            error_message = "Error in processing the query"
        
        # Generate timestamp
        # timestamp = datetime.now().isoformat()
        
        # Create the flattened ticket
        ticket = {
            # "ticket_id": f"TKT-{query_id[:8]}",
            # "query_id": query_id,
            # "query_type": query_type,
            # "branch_id": branch_id,
            # "query_level": query_level,
            # "role_level":query_level,
            # "role_name": role_name,  # Add this if required
            # "branch_level": branch_level,
            # "department": department,
            # "service_type": service_type,
            # "request_category": request_category,
            "transcribed_text": transcribed_text,
            "translated_query": translated_query,
            "detected_language": detected_language,
            # "priority": priority,
            #"created_at": timestamp,
            #"last_updated_at": timestamp
        }

        
        # Add error message if success is False and error_message is provided
        if not success and error_message:
            ticket["error_message"] = error_message
        
        return ticket
    except Exception as e:
        logger.error(f"Error generating ticket: {str(e)}")
        # Return a minimal ticket with error information
        return {
            "ticket_id": f"TKT-ERR-{str(uuid.uuid4())[:8]}",
            "query_id": query_id or str(uuid.uuid4()),
            "success": False,  # Success field instead of status
            "error_message": str(e),
            # "created_at": datetime.now().isoformat()
        }

def save_ticket_to_file(ticket, filename=None):
    """
    Save ticket to a JSON file.
    
    Args:
        ticket (dict): The ticket to save
        filename (str, optional): Filename to save to. If None, generates a filename based on ticket_id.
    
    Returns:
        str: Path to the saved file
    """
    try:
        if not filename:
            ticket_id = ticket.get("ticket_id", f"TKT-{str(uuid.uuid4())[:8]}")
            filename = f"tickets/{ticket_id}.json"
        
        # Ensure the directory exists
        import os
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        # Save the ticket to file
        with open(filename, 'w') as f:
            json.dump(ticket, f, indent=2)
        
        logger.info(f"Ticket saved to {filename}")
        return filename
    except Exception as e:
        logger.error(f"Error saving ticket to file: {str(e)}")
        return None

if __name__ == "__main__":
    # For testing purposes
    test_ticket = generate_ticket(
        # query_id="test-123",
        # query_type="text",
        # branch_id="BR001",
        # query_level="branch",
        # status="pending",
        # department="Account",
        # service_type="Opening",
        # request_category="Savings",
        transcribed_text="I want to open a savings account",
        translated_query="",
        detected_language="en",
        # priority="medium",
        # urgency="low"
    )
    
    print(f"Generated ticket: {json.dumps(test_ticket, indent=2)}")
    
    # Uncomment to test saving to file
    # save_ticket_to_file(test_ticket) 