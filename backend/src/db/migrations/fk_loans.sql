ALTER TABLE loans
    ADD CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE loans
    ADD CONSTRAINT fk_account_id
    FOREIGN KEY (account_id)
    REFERENCES accounts(id)
    ON DELETE CASCADE;

ALTER TABLE loans
    ADD CONSTRAINT fk_approved_by
    FOREIGN KEY (approved_by)
    REFERENCES employees(id);
