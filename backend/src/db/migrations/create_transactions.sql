CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'loan_repayment')),
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    initiated_by UUID NOT NULL,
    initiated_by_type VARCHAR(10) NOT NULL CHECK (initiated_by_type IN ('user', 'employee')),
    approved_by UUID,
    created_at TIMESTAMP DEFAULT NOW()
);
