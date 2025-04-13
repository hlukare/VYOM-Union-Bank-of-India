"""
This module contains predefined categories for banking query classification.
Categories are in snake_case format (lowercase with underscores).
"""

department = {
    "operations": {
        "service_type": {
            "account_services": {
                " request_category": [
                    "account_opening",
                    "account_closure",
                    "account_information",
                    "balance_inquiry",
                    "statement_request",
                    "passbook_update"
                ]
            },
            "card_services": {
                " request_category": [
                    "atm_issues",
                    "credit_card_issues",
                    "debit_card_issues",
                    "card_activation",
                    "card_blocking",
                    "pin_generation"
                ]
            },
            "cheque_services": {
                " request_category": [
                    "cheque_issuance",
                    "cheque_renewal",
                    "cheque_status",
                    "cheque_stop_payment"
                ]
            },
            "digital_banking": {
                " request_category": [
                    "internet_banking_registration",
                    "mobile_banking_issues",
                    "password_reset",
                    "transaction_issues",
                    "upi_related"
                ]
            },
            "general": {
                " request_category": [
                    "general_banking_queries",
                    "branch_information",
                    "working_hours",
                    "contact_information"
                ]
            }
        }
    },
    "loans": {
        "service_type": {
            "home_loan": {
                " request_category": [
                    "union_home",
                    "union_mortgage",
                    "union_rent",
                    "union_construction"
                ]
            },
            "vehicle_loan": {
                " request_category": [
                    "union_vehicle",
                    "union_car",
                    "union_two_wheeler"
                ]
            },
            "educational_loan": {
                " request_category": [
                    "union_education_india_abroad_nri_student"
                ]
            },
            "personal_loan": {
                " request_category": [
                    "union_personal_salaried_individual_other_than_government_employee",
                    "union_personal_government_employee",
                    "union_personal_pensioner"
                ]
            },
            "gold_loan": {
                " request_category": [
                    "union_gold_loan_agriculture",
                    "union_gold_loan_non_agriculture"
                ]
            },
            "msme_loan": {
                " request_category": [
                    "union_msme_working_capital",
                    "union_msme_term_loan",
                    "union_msme_equipment_finance"
                ]
            }
        }
    },
    "investments": {
        "service_type": {
            "deposits": {
                " request_category": [
                    "fixed_deposit",
                    "recurring_deposit",
                    "tax_saving_deposit"
                ]
            },
            "mutual_funds": {
                " request_category": [
                    "equity_funds",
                    "debt_funds",
                    "hybrid_funds",
                    "sip_related"
                ]
            },
            "insurance": {
                " request_category": [
                    "life_insurance",
                    "health_insurance",
                    "vehicle_insurance",
                    "premium_payment"
                ]
            }
        }
    },
    "complaints": {
        "service_type": {
            "service_issues": {
                " request_category": [
                    "staff_behavior",
                    "long_waiting_time",
                    "incorrect_information"
                ]
            },
            "transaction_issues": {
                " request_category": [
                    "failed_transaction",
                    "wrong_amount",
                    "duplicate_transaction",
                    "unauthorized_transaction"
                ]
            },
            "digital_issues": {
                " request_category": [
                    "website_problems",
                    "app_problems",
                    "login_issues"
                ]
            }
        }
    },
    "fraud_security": {
        "service_type": {
            "fraud_reporting": {
                " request_category": [
                    "account_fraud",
                    "card_fraud",
                    "phishing_attack",
                    "identity_theft"
                ]
            },
            "security_concerns": {
                " request_category": [
                    "suspicious_activity",
                    "unauthorized_access",
                    "data_privacy"
                ]
            }
        }
    }
}

# For backward compatibility
CATEGORIES = {
    "Account": {
        "Opening": ["Savings", "Current", "Fixed Deposit", "Recurring Deposit", "Salary"],
        "Closing": ["Savings", "Current", "Fixed Deposit", "Recurring Deposit"],
        "Statement": ["Monthly", "Quarterly", "Annual", "Custom Period"],
        "Balance": ["Minimum Balance", "Average Balance", "Current Balance"],
        "Updates": ["Address", "Phone Number", "Email", "KYC", "Nominee"]
    },
    "Loans": {
        "Personal": ["Application", "Disbursement", "EMI", "Foreclosure", "Interest Rate"],
        "Home": ["Application", "Disbursement", "EMI", "Foreclosure", "Interest Rate"],
        "Vehicle": ["Application", "Disbursement", "EMI", "Foreclosure", "Interest Rate"],
        "Education": ["Application", "Disbursement", "EMI", "Foreclosure", "Interest Rate"],
        "Business": ["Application", "Disbursement", "EMI", "Foreclosure", "Interest Rate"]
    },
    "Cards": {
        "Credit": ["Application", "Activation", "Bill Payment", "Limit Increase", "Lost/Stolen", "Rewards"],
        "Debit": ["Application", "Activation", "PIN Reset", "Lost/Stolen", "International Usage"],
        "Prepaid": ["Loading", "Balance Check", "Transaction History"]
    },
    "Digital Banking": {
        "Internet Banking": ["Registration", "Login Issues", "Transaction Issues", "Password Reset"],
        "Mobile Banking": ["Registration", "Login Issues", "Transaction Issues", "Password Reset"],
        "UPI": ["Registration", "Transaction Issues", "Limit Increase"]
    },
    "Investments": {
        "Mutual Funds": ["Purchase", "Redemption", "SIP", "Statement"],
        "Insurance": ["Life", "Health", "Vehicle", "Property", "Premium Payment"],
        "Stocks": ["Trading Account", "Demat Account", "Transaction Issues"]
    },
    "Complaints": {
        "Service Quality": ["Branch", "Call Center", "Digital Channels"],
        "Transaction": ["Failed", "Wrong Amount", "Duplicate", "Unauthorized"],
        "Staff Behavior": ["Rude", "Unhelpful", "Discriminatory"],
        "System Issues": ["Downtime", "Errors", "Slow Performance"]
    },
    "Fraud": {
        "Account": ["Unauthorized Access", "Identity Theft"],
        "Cards": ["Unauthorized Transactions", "Skimming", "Phishing"],
        "Digital": ["Phishing", "Vishing", "Malware", "Hacking"],
        "Impersonation": ["Staff Impersonation", "Bank Impersonation"]
    },
    "General Inquiry": {
        "Products": ["Features", "Eligibility", "Documentation", "Charges"],
        "Services": ["Availability", "Process", "Timelines"],
        "Branch": ["Location", "Timings", "Services Available"],
        "Promotions": ["Offers", "Discounts", "Cashbacks"]
    }
}

# Flattened list of all categories for easier lookup
ALL_CATEGORIES = []
for department, service_type in CATEGORIES.items():
    for service_type,  request_category in service_type.items():
        for request_category in  request_category:
            ALL_CATEGORIES.append({
                "department": department,
                "service_type": service_type,
                "request_category": request_category
            })

def get_all_categories():
    """Return the flattened list of all categories."""
    return ALL_CATEGORIES

def get_category_structure():
    """Return the full department structure."""
    return CATEGORIES 