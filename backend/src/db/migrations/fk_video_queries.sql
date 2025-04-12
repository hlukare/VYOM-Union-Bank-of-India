ALTER TABLE video_queries
    ADD CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE video_queries
    ADD CONSTRAINT fk_assigned_to
    FOREIGN KEY (assigned_to)
    REFERENCES employees(id)
    ON DELETE SET NULL;
