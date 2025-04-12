ALTER TABLE user_otps
    ADD CONSTRAINT fk_user_otp_user FOREIGN KEY (user_id) 
    REFERENCES users(id) ON DELETE CASCADE;

