import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/authRequest.type";
import { ApiResponse } from "../../../utils/ApiResponse";
import sendAadharOtp from "../../../services/user/register/aadhar/sendAadharOtp.service";
import verifyAadharOtp from "../../../services/user/register/aadhar/verifyAadharOtp.service";
import { UnauthorizedError, ValidationError } from "../../../utils/errors";

export const sendAadharVerificationController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const id = req?.user?.id;
    const { aadhar_number } = req.body;
    if (!id) throw new UnauthorizedError("Unauthorized: No user found");
    if (!aadhar_number) throw new ValidationError("Aadhar Number is required");
    try {
        const { ref_id } = await sendAadharOtp(aadhar_number);
        ApiResponse.send(res, 200, "OTP sent successfully", { ref_id });
        return;
    } catch (error) {
        next(error);
    }
};

export const verifyAadharVerificationController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const id = req?.user?.id;
    const { otp, aadhar_number } = req.body;
    if (!id) throw new UnauthorizedError("Unauthorized: No user found");
    if (!aadhar_number) throw new ValidationError("Aadhar Number is required");
    if (!otp) throw new ValidationError("OTP is required");
    try {
        await verifyAadharOtp(id, aadhar_number, otp);
        ApiResponse.send(res, 200, "Aadhar verified successfully", {
            next_step: "other",
        });
        return;
    } catch (error) {
        next(error);
    }
};
