def normalize(value, min_val, max_val):
    """Ensures value is scaled between 0 and 1 based on the given min and max."""
    return (value - min_val) / (max_val - min_val) if max_val > min_val else 0

def set_priority(loans, holdings, cibil, income):
    """
    Determines the priority of a query based on financial parameters.

    Args:
        loans (float): Total loan amount.
        holdings (float): Total asset holdings.
        cibil (int): CIBIL credit score (300-900).
        income (float): Monthly income.

    Returns:
        str: "Low Priority", "Medium Priority", or "High Priority"
    """
    # Normalizing values using realistic caps
    L_norm = normalize(loans, 0, 100)
    H_norm = 1 - normalize(holdings, 0, 500)
    C_norm = 1 - normalize(cibil, 300, 900)
    I_norm = 1 - normalize(income, 0, 100)

    # Compute Priority Score
    priority_score = (0.3 * L_norm) + (0.2 * H_norm) + (0.25 * C_norm) + (0.25 * I_norm)

    # Classify Priority
    if priority_score <= 0.3:
        return "Low Priority"
    elif priority_score <= 0.6:
        return "Medium Priority"
    else:
        return "High Priority"
