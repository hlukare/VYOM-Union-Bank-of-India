# roles.py

def classify_role(department, query_type):
    """
    Classifies the role based on the department and query type.
    """
    level_1_roles = ["customer_service_rep", "call_center_agent", "loan_officer", "branch_teller"]
    level_2_roles = ["branch_manager", "technical_support", "complaint_officer", "loan_manager"]
    level_3_roles = ["regional_operations_manager", "fraud_investigator", "it_manager", "credit_risk_analyst", "regional_loan_head"]
    level_4_roles = ["compliance_officer", "risk_management", "legal_team", "risk_management_head", "loans_compliance_officer"]

    # Default role (Level 1 - Customer Service Rep)
    role_data = {
        "role_name": "customer_service_rep",
        "role_level": 1,
        "department": department,
        "branch_level": True
    }

    if department in level_1_roles:
        role_data["role_name"] = department
        role_data["role_level"] = 1
        role_data["branch_level"] = True
    elif department in level_2_roles:
        role_data["role_name"] = department
        role_data["role_level"] = 2
        role_data["branch_level"] = True
    elif department in level_3_roles:
        role_data["role_name"] = department
        role_data["role_level"] = 3
        role_data["branch_level"] = False
    elif department in level_4_roles:
        role_data["role_name"] = department
        role_data["role_level"] = 4
        role_data["branch_level"] = False

    return role_data
