import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../types/authRequest.type";
import { UnauthorizedError } from "../../../utils/errors";
import { ValidationError } from "zod-validation-error";
import { ApiResponse } from "../../../utils/ApiResponse";
import { addOtherDetails } from "../../../services/user/register/otherDetails.service";

export const otherDetailsController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const id = req?.user?.id;
    const { occupation, annual_income, marital_status } = req.body;
    if (!id) throw new UnauthorizedError("Unauthorized: No user found");
    if (!occupation || !annual_income || !marital_status)
        throw new ValidationError("All fields are required");
    try {
        await addOtherDetails(id, occupation, annual_income, marital_status);
        ApiResponse.send(res, 200, "Other details added successfully");
        return;
    } catch (error) {
        next(error);
    }
};
