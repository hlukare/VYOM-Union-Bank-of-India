import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/authRequest.type";
import { UnauthorizedError, ValidationError } from "../../../utils/errors";
import { ApiResponse } from "../../../utils/ApiResponse";
import { DocumentFilesType } from "../../../types/cloudinaryFile.type";
import { uploadDocuments } from "../../../services/user/register/uploadDocuments.service";

export const uploadDocumnentsController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req?.user?.id;
        if (!id) throw new UnauthorizedError("Unauthorized: No user found");

        const files = req.files as unknown as DocumentFilesType;

        if (!files) throw new ValidationError("Files are required");

        if (!files.aadhar || !files.pan || !files.signature) {
            throw new ValidationError("All files are required");
        }

        // TODO: VERIFY THE DOCUMENTS USING AI

        await uploadDocuments(id, files);

        ApiResponse.send(res, 200, "Documents uploaded successfully");
        return;
    } catch (error) {
        next(error);
    }

    return;
};
