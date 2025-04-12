import { ValidationError } from "../../../../utils/errors";
import { sendOtp } from "../../../otp.service";
import { storeData } from "../../../redis/dataOperation";

type aadharSendOtpResponseType = {
    status: string;
    message: string;
    ref_id: string;
};

export default async function sendAadharOtp(aadhar_number: string) {
    const aadharRegex = /^[2-9]{1}[0-9]{11}$/;
    if (!aadharRegex.test(aadhar_number)) {
        throw new ValidationError("Invalid aadhar number");
    }
    // TODO: Call Aadhar verification API: SEND OTP
    try {
        const response: aadharSendOtpResponseType = await demoAadharServer({
            aadhar_number,
        });
        if (response.status !== "success") {
            throw new ValidationError(response.message);
        }
        return response;
    } catch (error: any) {
        throw error;
    }
}

const demoAadharServer = async ({
    aadhar_number,
}: {
    aadhar_number: string;
}) => {
    const ref_id = Math.floor(10000000 + Math.random() * 90000000).toString();
    await storeData(aadhar_number, ref_id);
    await sendOtp(aadhar_number, ref_id);

    return {
        status: "success",
        message: "OTP sent successfully",
        ref_id,
    };
};
