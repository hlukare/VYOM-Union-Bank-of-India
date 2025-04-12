ALTER TABLE service_tickets
    ADD CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;

ALTER TABLE service_tickets
    ADD CONSTRAINT fk_assigned_to
    FOREIGN KEY (assigned_to)
    REFERENCES employees(id)
    ON DELETE SET NULL;

ALTER TABLE service_tickets
    ADD CONSTRAINT fk_video_query_id
    FOREIGN KEY (video_query_id)
    REFERENCES video_queries(id)
    ON DELETE SET NULL;
