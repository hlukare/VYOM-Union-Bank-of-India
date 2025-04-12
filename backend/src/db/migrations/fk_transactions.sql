ALTER TABLE transactions
    ADD CONSTRAINT fk_account_id
    FOREIGN KEY (account_id)
    REFERENCES accounts(id)
    ON DELETE CASCADE;

ALTER TABLE transactions
    ADD CONSTRAINT fk_approved_by
    FOREIGN KEY (approved_by)
    REFERENCES employees(id);