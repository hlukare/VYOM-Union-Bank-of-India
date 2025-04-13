import os
import json
import logging
import re
from dotenv import load_dotenv
from groq import Groq
from categories import ALL_CATEGORIES, get_category_structure, get_all_categories

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Groq API key should be set as an environment variable
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY environment variable not set. Classification will not work properly.")

# Set categories
CATEGORIES = ALL_CATEGORIES

def detect_language(text):
    """Detect the language of the text using Groq API."""
    try:
        if not GROQ_API_KEY:
            return "unknown"
        
        client = Groq(api_key=GROQ_API_KEY)
        
        prompt = f"""Detect the language of the following text and return only the ISO 639-1 language code (e.g., 'en' for English, 'hi' for Hindi, etc.):

Text: {text}

Language code:"""
        
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system",
                    "content": "You are a language detection assistant. Respond with only the ISO 639-1 language code. first do analysis and then return the analysis in 3-4 lines only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=10
        )
        
        language_code = response.choices[0].message.content.strip()
        return language_code
    except Exception as e:
        logger.error(f"Error detecting language: {str(e)}")
        return "unknown"

def translate_to_english(text, source_language):
    """Translate text to English if not already in English."""
    try:
        if source_language == "en" or source_language == "unknown":
            return text
        
        if not GROQ_API_KEY:
            return text
        
        client = Groq(api_key=GROQ_API_KEY)
        
        prompt = f"""Translate the following text from {source_language} to English. analyze the text and only, strictly only return 2-3 lines (remember this):

Original text: {text}

English translation:"""
        
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system",
                    "content": "You are a translation assistant. Translate the given text to English.Analyze and remove unnecessary text, extra punctuation, and newlines. Provide a concise summary in 2-3 sentences."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=1000
        )
        
        translated_text = response.choices[0].message.content.strip()
        return translated_text
    except Exception as e:
        logger.error(f"Error translating text: {str(e)}")
        return text


def classify_text(text):
    """
    Classify the text into department, service_type, and request_category using Groq API.
    Falls back to keyword-based classification if API fails.
    """
    try:
        if not GROQ_API_KEY:
            logger.warning("GROQ_API_KEY not set, using fallback classification")
            return fallback_classification(text)
        
        client = Groq(api_key=GROQ_API_KEY)
        
        # Format categories for the prompt
        categories_str = json.dumps(CATEGORIES, indent=2)
        
        prompt = f"""Given the following categories:{categories_str} And the following text: "{text}" Please classify this text into the most appropriate department, service_type, and request_category if applicable.Return the result in the following format:department: [main department]service_type: [service_type]subsubcategory: [request_category or 'none' if not applicable] Be specific and accurate in your classification. Use snake_case for all department names (lowercase with underscores)."""

        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that accurately classifies banking-related queries. Always use snake_case (lowercase with underscores) for all department names."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
        )

        classification_text = response.choices[0].message.content
        
        # Parse the classification response
        lines = classification_text.strip().split('\n')
        classification = {}
        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                classification[key.strip()] = value.strip().lower().replace(' ', '_')
        
        # Ensure all required keys are present
        if 'department' not in classification:
            classification['department'] = 'operations'
        if 'service_type' not in classification:
            classification['service_type'] = 'general'
        if 'subsubcategory' not in classification:
            classification['subsubcategory'] = 'general_banking_queries'
        
        return classification
        
    except Exception as e:
        # Fallback classification if API fails
        logger.error(f"Error in classification API: {str(e)}")
        logger.info("Using fallback classification")
        return fallback_classification(text)

def fallback_classification(text):
    """Simple keyword-based classification as fallback."""
    # Default classification
    classification = {
        "department": "operations",
        "service_type": "general",
        "subsubcategory": "general_banking_queries"
    }
    
    # Simple keyword-based classification as fallback
    text = text.lower()
    
    # Check for loan-related keywords
    loan_keywords = ["loan", "credit", "borrow", "finance", "mortgage", "emi"]
    if any(keyword in text for keyword in loan_keywords):
        classification["department"] = "loans"
        
        # Check for specific loan types
        if any(word in text for word in ["home", "house", "property", "flat", "apartment"]):
            classification["service_type"] = "home_loan"
            classification["subsubcategory"] = "union_home"
        elif any(word in text for word in ["car", "vehicle", "auto", "bike", "motorcycle"]):
            classification["service_type"] = "vehicle_loan"
            classification["subsubcategory"] = "union_vehicle"
        elif any(word in text for word in ["education", "college", "university", "school", "study"]):
            classification["service_type"] = "educational_loan"
            classification["subsubcategory"] = "union_education_india_abroad_nri_student"
        elif any(word in text for word in ["personal", "individual"]):
            classification["service_type"] = "personal_loan"
            classification["subsubcategory"] = "union_personal_salaried_individual_other_than_government_employee"
        elif any(word in text for word in ["gold", "jewelry"]):
            classification["service_type"] = "gold_loan"
            classification["subsubcategory"] = "union_gold_loan_agriculture"
        else:
            classification["service_type"] = "personal_loan"
            classification["subsubcategory"] = "union_personal_salaried_individual_other_than_government_employee"
    
    # Check for account-related keywords
    elif any(word in text for word in ["account", "savings", "current", "deposit", "withdraw"]):
        classification["department"] = "operations"
        classification["service_type"] = "account_services"
        
        if "open" in text:
            classification["subsubcategory"] = "account_opening"
        elif any(word in text for word in ["close", "terminate"]):
            classification["subsubcategory"] = "account_closure"
        else:
            classification["subsubcategory"] = "account_information"
    
    # Check for card-related keywords
    elif any(word in text for word in ["card", "atm", "credit", "debit"]):
        classification["department"] = "operations"
        classification["service_type"] = "card_services"
        
        if "atm" in text:
            classification["subsubcategory"] = "atm_issues"
        elif "credit" in text:
            classification["subsubcategory"] = "credit_card_issues"
        elif "debit" in text:
            classification["subsubcategory"] = "debit_card_issues"
        elif any(word in text for word in ["activate", "activation"]):
            classification["subsubcategory"] = "card_activation"
        elif any(word in text for word in ["block", "lost", "stolen"]):
            classification["subsubcategory"] = "card_blocking"
    
    # Check for cheque-related keywords
    elif any(word in text for word in ["cheque", "check", "checkbook"]):
        classification["department"] = "operations"
        classification["service_type"] = "cheque_services"
        
        if any(word in text for word in ["new", "renew", "reorder"]):
            classification["subsubcategory"] = "cheque_renewal"
        else:
            classification["subsubcategory"] = "cheque_issuance"
    
    # Check for investment-related keywords
    elif any(word in text for word in ["invest", "mutual fund", "insurance", "fd", "fixed deposit"]):
        classification["department"] = "investments"
        
        if any(word in text for word in ["fd", "fixed deposit", "recurring"]):
            classification["service_type"] = "deposits"
            classification["subsubcategory"] = "fixed_deposit"
        elif any(word in text for word in ["mutual fund", "sip"]):
            classification["service_type"] = "mutual_funds"
            classification["subsubcategory"] = "equity_funds"
        elif any(word in text for word in ["insurance", "life", "health"]):
            classification["service_type"] = "insurance"
            classification["subsubcategory"] = "life_insurance"
    
    # Check for complaint-related keywords
    elif any(word in text for word in ["complaint", "issue", "problem", "unhappy", "dissatisfied"]):
        classification["department"] = "complaints"
        
        if any(word in text for word in ["staff", "behavior", "rude", "service"]):
            classification["service_type"] = "service_issues"
            classification["subsubcategory"] = "staff_behavior"
        elif any(word in text for word in ["transaction", "payment", "transfer"]):
            classification["service_type"] = "transaction_issues"
            classification["subsubcategory"] = "failed_transaction"
        elif any(word in text for word in ["website", "app", "online", "mobile"]):
            classification["service_type"] = "digital_issues"
            classification["subsubcategory"] = "app_problems"
    
    # Check for fraud-related keywords
    elif any(word in text for word in ["fraud", "scam", "hack", "unauthorized", "suspicious"]):
        classification["department"] = "fraud_security"
        
        if any(word in text for word in ["account", "transaction"]):
            classification["service_type"] = "fraud_reporting"
            classification["subsubcategory"] = "account_fraud"
        elif any(word in text for word in ["card", "credit", "debit"]):
            classification["service_type"] = "fraud_reporting"
            classification["subsubcategory"] = "card_fraud"
        elif any(word in text for word in ["phishing", "email", "message", "call"]):
            classification["service_type"] = "fraud_reporting"
            classification["subsubcategory"] = "phishing_attack"
        else:
            classification["service_type"] = "security_concerns"
            classification["subsubcategory"] = "suspicious_activity"
    
    return classification

def classify_query(query_text):
    """
    Classify the query into department, service_type, and request_category.
    Also detect language and translate if not in English.
    """
    try:
        if not query_text:
            return {
                "department": "operations",
                "service_type": "general",
                "request_category": "general_banking_queries",
                "translated_query": "",
                "detected_language": "en"
            }
        
        # Detect language
        detected_language = detect_language(query_text)
        
        # Translate if not in English
        translated_query = ""
        if detected_language != "en" and detected_language != "unknown":
            translated_query = translate_to_english(query_text, detected_language)
            text_to_classify = translated_query
        else:
            text_to_classify = query_text
        
        # Classify the text
        classification = classify_text(text_to_classify)
        
        # Format the result to match the expected output
        result = {
            "department": classification.get("department", "operations"),
            "service_type": classification.get("service_type", "general"),
            "request_category": classification.get("subsubcategory", "general_banking_queries"),
            "translated_query": translated_query,
            "detected_language": detected_language
        }
        
        return result
    except Exception as e:
        logger.error(f"Error classifying query: {str(e)}")
        return {
            "department": "operations",
            "service_type": "general",
            "request_category": "general_banking_queries",
            "translated_query": "",
            "detected_language": "unknown"
        }  # ❌ Removed the extra double-quote here


if __name__ == "__main__":
    # Test the function
    test_query = "I want to open a new savings account"
    print(classify_query(test_query)) 