ALTER TABLE feedback
    ADD CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE feedback
    ADD CONSTRAINT fk_employee_id
    FOREIGN KEY (employee_id)
    REFERENCES employees(id)
    ON DELETE SET NULL;