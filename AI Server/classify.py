import os
import logging
from dotenv import load_dotenv
from groq import Groq

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
load_dotenv()

# Groq API Key (set as an environment variable)
API_KEY = os.getenv("GROQ_API_KEY")

# Initialize the Groq client with the API Key
client = Groq(api_key=API_KEY)

def classify_text(text):
    """Classifies the transcribed text into predefined categories using Llama 3.3 via Groq API."""
    if not API_KEY:
        logging.error("Groq API Key is missing. Set GROQ_API_KEY environment variable.")
        return {"category": "Unknown", "subcategory": "Unknown", "transcribed_text": text}

    logging.info("Classifying transcribed text using Llama 3.3 via Groq API...")
    
    prompt = f"""
    You are a customer support assistant for a bank. Your task is to classify customer queries into predefined categories.
    The query provided is transcribed from a customer’s speech and may have minor errors.

    **Categories:**
    1. Account Services
        - Account Opening
        - Account Closure
        - Account Information
    2. Loan Services
        - Loan Inquiry
        - Loan Payment Issues
        - Loan Status
    3. Cash Transactions
        - Cash Withdrawal
        - Cash Deposit
        - ATM Issues
    4. Card Services
        - Credit Card Issues
        - Debit Card Issues
        - Card Activation
        - Card Blocking
    5. Fraud & Dispute Resolution
        - Unauthorized Transactions
        - Dispute a Transaction
        - Report Fraud
    6. Customer Support & General Queries
        - Branch Information
        - Interest Rates
        - General Banking Queries

    **Task:** Given the following transcribed query, classify it into one of the categories and subcategories. If the query is unclear, choose the closest matching category.

    **Query:**
    "{text}"

    **Expected JSON Response:**
    {{
      "category": "Category Name",
      "subcategory": "Subcategory Name (if applicable)",
      "transcribed_text": "Corrected and translated English version of the query"
    }}
    """

    # Call the Groq API to classify the text using Llama 3.3 model
    try:
        logging.info("Sending request to Groq API...")

        # Send the chat completion request to Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",  # Model used for text classification
        )

        # Extract the response content
        result_text = chat_completion.choices[0].message.content.strip()

        # Extract JSON response from text (if present)
        import re
        import json

        match = re.search(r"\{.*\}", result_text, re.DOTALL)
        classified_data = json.loads(match.group()) if match else {
            "category": "Unknown",
            "subcategory": "Unknown",
            "transcribed_text": text
        }

    except Exception as e:
        logging.error(f"Error during classification: {e}")
        classified_data = {"category": "Unknown", "subcategory": "Unknown", "transcribed_text": text}

    logging.info(f"Classification result: {classified_data}")
    return classified_data
