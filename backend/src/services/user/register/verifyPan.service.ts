import { getRecords, updateRecord } from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { PanVerificationType } from "../../../types/panVerification.type";
import { UserType } from "../../../types/tables/user.type";
import {
    ValidationError,
    InternalServerError,
    ConflictError,
} from "../../../utils/errors";

export async function verifyPan(
    id: string,
    pan_number: string,
    name: string,
    dob: string
) {
    try {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(pan_number))
            throw new ValidationError("Invalid PAN");
        const date = new Date(dob);
        if (isNaN(date.getTime()) || new Date() < date)
            throw new ValidationError("Invalid date of birth");

        const nameRegex = /^[a-zA-Z ]+$/;
        if (!nameRegex.test(name)) throw new ValidationError("Invalid name");

        // TODO: Call PAN verification API
        const panDetails: PanVerificationType = await getPanDetails(pan_number);
        if (!panDetails || panDetails.status !== "VALID") {
            throw new ConflictError(
                "PAN is already registered with another user or invalid"
            );
        }

        if (
            name.toLowerCase() !== panDetails.name.toLowerCase() ||
            date.toDateString() !== new Date(panDetails.dob).toDateString()
        ) {
            throw new ConflictError(
                "Name or date of birth does not match with PAN records"
            );
        }

        await updateRecord<UserType>(
            tables.users,
            {
                pan_number,
                name,
                dob: new Date(dob),
                registration_status: "aadhar",
                updated_at: new Date(),
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
    } catch (error) {
        throw error;
    }
}

const getPanDetails = async (
    pan_number: string
): Promise<PanVerificationType> => {
    return new Promise((resolve) => {
        return resolve({
            verification_id: "test001",
            reference_id: 21637861,
            pan: "ABCCO1234G",
            name: "John Doe",
            dob: "1993-06-30",
            name_match: "Y",
            dob_match: "Y",
            pan_status: "E",
            status: "VALID",
            aadhaar_seeding_status: "Y",
            aadhaar_seeding_status_desc: "Aadhaar is linked to PAN",
        });
    });
};
