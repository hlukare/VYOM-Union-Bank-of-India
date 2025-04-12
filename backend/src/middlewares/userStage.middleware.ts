import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest.type";
import { RegistrationStatusType } from "../types/tables/user.type";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import { getUser } from "../services/user/getUser.service";

export const userStage = (stage: RegistrationStatusType) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req?.user?.id;
            if (!id) throw new UnauthorizedError("Unauthorized: No user found");
            // Verify User
            const user = await getUser(id);

            if (user.length === 0) {
                throw new UnauthorizedError("User not found");
            }
            if (user[0]?.registration_status !== stage) {
                throw new ConflictError("Choose a valid method");
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
