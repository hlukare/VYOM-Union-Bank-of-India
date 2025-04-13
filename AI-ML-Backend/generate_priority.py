import os
import json
import logging
import re
from groq import Groq

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Groq API key should be set as an environment variable
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY environment variable not set. Priority generation will use rule-based approach only.")

def calculate_financial_priority(cibil_score, holdings, annual_income, loans):
    """
    Calculate priority based on financial parameters.
    
    Args:
        cibil_score (int/float): Customer's CIBIL score (300-900)
        holdings (float): Customer's holdings/investments in the bank
        annual_income (float): Customer's annual income
        loans (float): Customer's outstanding loans
    
    Returns:
        str: Priority level ('low', 'medium', 'high')
    """
    try:
        # Convert inputs to appropriate types
        try:
            cibil_score = float(cibil_score) if cibil_score is not None else 700
            holdings = float(holdings) if holdings is not None else 0
            annual_income = float(annual_income) if annual_income is not None else 0
            loans = float(loans) if loans is not None else 0
        except (ValueError, TypeError):
            logger.warning("Invalid financial parameters provided, using defaults")
            cibil_score = 700
            holdings = 0
            annual_income = 0
            loans = 0
        
        # Calculate priority based on financial parameters
        priority_score = 0
        
        # CIBIL Score contribution (higher score = higher priority)
        if cibil_score >= 800:
            priority_score += 3
        elif cibil_score >= 700:
            priority_score += 2
        elif cibil_score >= 600:
            priority_score += 1
        
        # Holdings contribution (higher holdings = higher priority)
        if holdings >= 1000000:  # 10 lakhs or more
            priority_score += 3
        elif holdings >= 100000:  # 1 lakh or more
            priority_score += 2
        elif holdings >= 10000:   # 10k or more
            priority_score += 1
        
        # Annual income contribution (higher income = higher priority)
        if annual_income >= 1000000:  # 10 lakhs or more
            priority_score += 3
        elif annual_income >= 500000:  # 5 lakhs or more
            priority_score += 2
        elif annual_income >= 250000:  # 2.5 lakhs or more
            priority_score += 1
        
        # Loans contribution (higher loans = higher priority, as they're more valuable customers)
        if loans >= 5000000:  # 50 lakhs or more
            priority_score += 3
        elif loans >= 1000000:  # 10 lakhs or more
            priority_score += 2
        elif loans >= 100000:   # 1 lakh or more
            priority_score += 1
        
        # Determine priority level based on score
        if priority_score >= 8:
            return "high"
        elif priority_score >= 4:
            return "medium"
        else:
            return "low"
    except Exception as e:
        logger.error(f"Error calculating financial priority: {str(e)}")
        return "medium"  # Default to medium priority on error

def check_critical_query(query_text):
    """
    Check if the query is about fraud, credit/debit block, or something very urgent.
    
    Args:
        query_text (str): The customer's query text
    
    Returns:
        bool: True if the query is critical, False otherwise
    """
    if not query_text:
        return False
    
    query_lower = query_text.lower()
    
    # Critical keywords
    critical_patterns = [
        r'\bfraud\b', r'\bstolen\b', r'\bhack\b', r'\bphish\b', r'\bunauthorized\b',
        r'\bblock\b.*\bcard\b', r'\blost\b.*\bcard\b', r'\bstolen\b.*\bcard\b',
        r'\bwrong\b.*\btransaction\b', r'\bfailed\b.*\btransaction\b',
        r'\bfrozen\b.*\baccount\b', r'\blocked\b.*\baccount\b',
        r'\bscam\b', r'\btheft\b', r'\bcompromised\b', r'\bsuspicious\b',
        r'\bemergency\b', r'\burgent\b', r'\bimmediate\b', r'\bcritical\b'
    ]
    
    # Check for critical patterns
    for pattern in critical_patterns:
        if re.search(pattern, query_lower):
            return True
    
    return False

def generate_priority(cibil_score, holdings, annual_income, loans, query_text):
    """
    Generate priority based on customer data and query content.
    
    Args:
        cibil_score (int/float): Customer's CIBIL score
        holdings (float): Customer's holdings/investments
        annual_income (float): Customer's annual income
        loans (float): Customer's outstanding loans
        query_text (str): The customer's query text
    
    Returns:
        dict: Dictionary containing priority level
    """
    try:
        # First check if the query is critical
        if check_critical_query(query_text):
            logger.info(f"Critical query detected: {query_text[:100]}...")
            return {
                "priority": "critical"
            }
        
        # If not critical, calculate priority based on financial parameters
        priority = calculate_financial_priority(cibil_score, holdings, annual_income, loans)
        
        return {
            "priority": priority
        }
    except Exception as e:
        logger.error(f"Error generating priority: {str(e)}")
        return {
            "priority": "medium"
        }

if __name__ == "__main__":
    # For testing purposes
    test_cibil_score = 750
    test_holdings = 200000
    test_annual_income = 600000
    test_loans = 1500000
    test_query = "I think there's an unauthorized transaction on my account. Please help urgently!"
    
    result = generate_priority(test_cibil_score, test_holdings, test_annual_income, test_loans, test_query)
    print(f"Priority result: {json.dumps(result, indent=2)}") 