CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_number VARCHAR(12) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    loan_type VARCHAR(50) NOT NULL CHECK (loan_type IN ('home', 'personal', 'education', 'auto')),
    loan_amount DECIMAL(15,2) NOT NULL CHECK (loan_amount > 0),
    interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate > 0),
    tenure INT NOT NULL CHECK (tenure > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('approved', 'pending', 'rejected', 'closed')),
    approved_by UUID,
    created_at TIMESTAMP DEFAULT NOW()
);
