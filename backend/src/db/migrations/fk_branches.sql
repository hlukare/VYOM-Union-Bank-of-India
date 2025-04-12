ALTER TABLE branches
    ADD CONSTRAINT fk_manager_id
    FOREIGN KEY (manager_id)
    REFERENCES employees(id);