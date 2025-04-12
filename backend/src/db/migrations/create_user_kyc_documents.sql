CREATE TABLE IF NOT EXISTS user_kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('aadhaar', 'pan', 'signature')),
    file_url TEXT NOT NULL,  -- Stores file links (PDF/Images)
    uploaded_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, document_type)
);

