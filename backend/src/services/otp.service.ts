import env from "../config/env";
import { phoneNumberSchema } from "../schemas/phoneNumber.schema";
import {
    fromError,
    ValidationError as zodValidationError,
} from "zod-validation-error";
import { getData, storeData } from "./redis/dataOperation";
import { ValidationError } from "../utils/errors";

const OTP_EXPIRY = 300; // 5 Minutes

const generateRandomOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (phoneNumber: string, id: string) => {
    try {
        // phoneNumberSchema.parse(phoneNumber);
        let otp;
        if (env.NODE_ENV.toString().includes("development")) {
            otp = "123456";
        } else {
            otp = generateRandomOTP();
            // Send OTP to user
        }
        await storeData(id, otp, OTP_EXPIRY);
    } catch (error) {
        if (error instanceof zodValidationError) {
            const err = fromError(error) as zodValidationError;
            throw new ValidationError(err.message);
        }
        throw error;
    }
};

const verifyOtp = async (id: string, otp: string): Promise<Boolean> => {
    try {
        // phoneNumberSchema.parse(id);
        const storedOtp = await getData(id);
        if (storedOtp !== otp) {
            return false;
        }
        return true;
    } catch (error) {
        if (error instanceof zodValidationError) {
            error = fromError(error);
        }
        throw error;
    }
};

export { sendOtp, verifyOtp };
