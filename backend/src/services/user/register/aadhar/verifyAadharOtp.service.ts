import {
    createRecord,
    getRecords,
    updateRecord,
} from "../../../../db/models/records";
import { tables } from "../../../../db/tables";
import { UserType } from "../../../../types/tables/user.type";
import { UserAddressType } from "../../../../types/tables/user_addresses.type";
import { ForbiddenError, ValidationError } from "../../../../utils/errors";
import { verifyOtp } from "../../../otp.service";
import { getData } from "../../../redis/dataOperation";

export default async function verifyAadharOtp(
    id: string,
    aadhar_number: string,
    otp: string
) {
    try {
        if (!id || !aadhar_number || !otp) {
            throw new ValidationError("Invalid input");
        }
        const ref_id = await getData(aadhar_number);

        // TODO: Call Aadhar verification API: VERIFY OTP
        const response = await demoAadharServer(ref_id, otp);

        if (!response) {
            throw new ValidationError("Invalid OTP");
        }

        const userUpdateObject: Partial<UserType> = {};
        // Mask the aadhar number
        userUpdateObject.aadhar_number = aadhar_number
            .slice(-4)
            .padStart(12, "*");
        // Get the DOB
        userUpdateObject.dob = new Date(response?.dob.split("T")[0]);
        // Get the gender
        userUpdateObject.gender = response?.gender as "M" | "F" | "Other";
        // Get the email
        if (response.email && response.email !== "") {
            userUpdateObject.email = response.email;
        }
        // Get photo link
        userUpdateObject.aadhar_photo_link = response?.photo_link;
        // Set Registration Status to other
        userUpdateObject.registration_status = "other";
        // Updated at
        userUpdateObject.updated_at = new Date();

        await updateRecord<UserType>(tables.users, userUpdateObject, {
            where: [
                {
                    column: "id",
                    operator: "=",
                    value: id,
                },
            ],
        });

        // Update the address
        const addressResponse = response.split_address;
        const userAddressObject: Partial<UserAddressType> = {
            address_type: "permanent",
        };

        userAddressObject.user_id = id;
        userAddressObject.country = addressResponse.country;
        userAddressObject.state = addressResponse.state;
        userAddressObject.district = addressResponse.dist;
        userAddressObject.city = addressResponse.vtc;
        userAddressObject.po = addressResponse.po;
        userAddressObject.pincode = addressResponse.pincode;
        userAddressObject.street = addressResponse.street;
        userAddressObject.house = addressResponse.house;
        userAddressObject.landmark = addressResponse.landmark;

        await createRecord<Partial<UserAddressType>>(
            tables.userAddresses,
            userAddressObject
        );
    } catch (error) {
        throw error;
    }
}

const demoAadharServer = async (ref_id: string, otp: string) => {
    try {
        await verifyOtp(ref_id, otp);
        return {
            ref_id: "70471",
            status: "VALID",
            message: "Aadhaar Card Exists",
            care_of: "S/O: Fakkirappa Dollin",
            address:
                "Shri Kanaka Nilaya,,Umashankar Nagar 1st Main 5th Cross,Ranebennur,Haveri-Karnataka,India",
            dob: "02-02-1995",
            email: "",
            gender: "M",
            name: "Mallesh Fakkirappa Dollin",
            split_address: {
                country: "India",
                dist: "Haveri",
                house: "Shri Kanaka Nilaya",
                landmark: "",
                pincode: "581115",
                po: "Ranebennur",
                state: "Karnataka",
                street: "Umashankar Nagar 1st Main 5th Cross",
                subdist: "Ranibennur",
                vtc: "Ranibennur",
                locality: "Pritam Pura",
            },
            year_of_birth: 1995,
            mobile_hash:
                "ed189eb73247cb90b769e7e8d7dfd2efa4cd6a5ec27602f5d2721c035266568c",
            photo_link: "<base64 encoded image>",
            share_code: "1234",
            xml_file: "<xml file link with 48hrs expiry>",
        };
    } catch (error) {
        throw error;
    }
};
