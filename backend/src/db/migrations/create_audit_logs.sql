CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('login', 'transaction', 'account_change', 'loan_request', 'service_ticket')),
    user_id UUID,
    employee_id UUID,
    details TEXT NOT NULL,  
    ip_address INET NOT NULL,  
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
