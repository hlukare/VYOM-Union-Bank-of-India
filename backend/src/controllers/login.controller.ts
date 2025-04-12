import { NextFunction, Request, Response } from "express";
import { sendOtp, verifyOtp } from "../services/otp.service";
import { ApiResponse } from "../utils/ApiResponse";
import { createRecord, getRecords, updateRecord } from "../db/models/records";
import { v4 as uuid } from "uuid";
import { UserSchemaForCreationType, UserType } from "../types/tables/user.type";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils";
import { ValidationError } from "../utils/errors";
import { tables } from "../db/tables";

export const phoneControllerSend = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { mobile_number } = req.body;
    if (!mobile_number) throw new ValidationError("Mobile number is required");
    try {
        await sendOtp(mobile_number, mobile_number);

        ApiResponse.send(res, 200, "OTP sent successfully");
        return;
    } catch (error) {
        next(error);
    }
};

export async function phoneControllerVerify(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { mobile_number, otp } = req.body;
    if (!mobile_number) throw new ValidationError("Mobile number is required");
    if (!otp) throw new ValidationError("OTP is required");
    try {
        const result: Boolean = await verifyOtp(mobile_number, otp);
        if (!result) throw new ValidationError("Invalid OTP");

        // Check if user exists
        const user = await getRecords(tables.users, {
            where: [
                {
                    column: "mobile_number",
                    operator: "=",
                    value: mobile_number,
                },
            ],
        });
        let authUser: { id: string } & Partial<UserType>;
        if (user.length === 0) {
            const id = uuid();
            await createRecord<UserSchemaForCreationType>(tables.users, {
                id,
                mobile_number,
                registration_status: "pan",
                created_at: new Date(),
                updated_at: new Date(),
            });
            authUser = {
                id,
                registration_status: "pan",
                mobile_number,
            };
        } else {
            authUser = user[0] as { id: string } & Partial<UserType>;
        }
        const accessToken = generateAccessToken(authUser.id);
        const refreshToken = generateRefreshToken(authUser.id);

        // Update refresh token in database
        await updateRecord<UserType>(
            tables.users,
            {
                refresh_token: refreshToken,
                updated_at: new Date(),
            },
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: authUser.id,
                    },
                ],
            }
        );

        // Send new tokens in response headers
        res.setHeader("x-access-token", accessToken);
        res.setHeader("x-refresh-token", refreshToken);

        ApiResponse.send(res, 200, "Phone Verified", {
            id: authUser.id,
            mobile_number: authUser.mobile_number,
            next_step: authUser.registration_status,
        });

        return;
    } catch (error) {
        next(error);
    }
}
