import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/authRequest.type";
import { UnauthorizedError, ValidationError } from "../../../utils/errors";
import { ApiResponse } from "../../../utils/ApiResponse";
import { registerFace } from "../../../services/user/register/faceRegistration.service";

export const faceRegistrationController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const id = req?.user?.id;
    const { facial_embedding } = req.body;

    if (!id) throw new UnauthorizedError("Unauthorized: No user found");
    if (!facial_embedding)
        throw new ValidationError("Facial Embedding is required");
    try {
        await registerFace(id, facial_embedding);
        ApiResponse.send(res, 200, "Face registered successfully");
        return;
    } catch (error) {
        next(error);
    }
};
