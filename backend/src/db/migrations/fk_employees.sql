ALTER TABLE employees
    ADD CONSTRAINT fk_branch_id
    FOREIGN KEY (branch_id)
    REFERENCES branches(id);