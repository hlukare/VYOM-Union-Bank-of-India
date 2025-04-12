import { createRecord, updateRecord } from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { DocumentFilesType } from "../../../types/cloudinaryFile.type";
import { UserType } from "../../../types/tables/user.type";
import { UserKycDocumentsType } from "../../../types/tables/user_kyc_document";
import { ConflictError, UnauthorizedError } from "../../../utils/errors";
import { getUser } from "../getUser.service";
export async function uploadDocuments(id: string, files: DocumentFilesType) {
    try {
        const aadhar = files.aadhar[0];
        const pan = files.pan[0];
        const signature = files.signature[0];

        // Update User
        // 1 AADHAR CARD
        const aadharUploadPromise = createRecord<UserKycDocumentsType>(
            tables.userKYCDocuments,
            {
                user_id: id,
                document_type: "aadhaar",
                file_url: aadhar.path,
            }
        );

        // 2 PAN CARD
        const panUploadPromise = createRecord<UserKycDocumentsType>(
            tables.userKYCDocuments,
            {
                user_id: id,
                document_type: "pan",
                file_url: pan.path,
            }
        );

        // 3 SIGNATURE
        const signatureUploadPromise = createRecord<UserKycDocumentsType>(
            tables.userKYCDocuments,
            {
                user_id: id,
                document_type: "signature",
                file_url: signature.path,
            }
        );

        // Upload All Documents
        await Promise.all([
            aadharUploadPromise,
            panUploadPromise,
            signatureUploadPromise,
        ]);

        // Update User
        await updateRecord<UserType>(
            tables.users,
            {
                registration_status: "vkyc",
            },
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: id,
                    },
                ],
            }
        );

        // Scheduule the appointment
    } catch (error) {
        throw error;
    }
}
