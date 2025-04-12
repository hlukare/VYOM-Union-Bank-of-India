ALTER TABLE video_kyc_sessions
    ADD CONSTRAINT fk_video_kyc_sessions
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;
