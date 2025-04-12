ALTER TABLE audit_logs
    ADD CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id);

ALTER TABLE audit_logs
    ADD CONSTRAINT fk_employee_id
    FOREIGN KEY (employee_id)
    REFERENCES employees(id);
