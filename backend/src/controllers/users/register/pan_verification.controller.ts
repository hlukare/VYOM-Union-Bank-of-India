import { NextFunction, Response } from "express";
import { verifyPan } from "../../../services/user/register/verifyPan.service";
import { AuthRequest } from "../../../types/authRequest.type";
import { ApiResponse } from "../../../utils/ApiResponse";
import { ValidationError, UnauthorizedError } from "../../../utils/errors";
export const panVerificationController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const { pan_number, name, dob } = req.body;
    const id = req?.user?.id;
    if (!id) throw new UnauthorizedError("Unauthorized: No user found");

    if (!pan_number) throw new ValidationError("Pan Number is required");
    if (!name) throw new ValidationError("Name is required");
    if (!dob) throw new ValidationError("Date of Birth is required");
    try {
        await verifyPan(id, pan_number, name, dob);
        ApiResponse.send(res, 200, "Pan verified successfully", {
            next_step: "aadhar",
        });
        return;
    } catch (error) {
        next(error);
    }
};
