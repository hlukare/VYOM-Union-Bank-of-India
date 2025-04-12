import { Router } from "express";
import {
    panVerificationController,
    sendAadharVerificationController,
    verifyAadharVerificationController,
    otherDetailsController,
    faceRegistrationController,
    uploadDocumnentsController,
} from "../../controllers/users/register/index";

import { uploadDynamicFiles } from "../../middlewares/uploadMiddleware";
import { userStage } from "../../middlewares/userStage.middleware";

const router = Router();

// STEP 1
router.post("/pan-verify", userStage("pan"), panVerificationController);

// STEP 2
router.post(
    "/aadhar-send-otp",
    userStage("aadhar"),
    sendAadharVerificationController
);
router.post(
    "/aadhar-verify-otp",
    userStage("aadhar"),
    verifyAadharVerificationController
);

// STEP 3
router.post("/other-details", userStage("other"), otherDetailsController);

// STEP 4
router.post(
    "/face-registration",
    userStage("face"),
    faceRegistrationController
);

// STEP 5
const upload = () => {
    return uploadDynamicFiles({
        fields: [
            {
                name: "aadhar",
                maxCount: 1,
            },
            {
                name: "pan",
                maxCount: 1,
            },
            {
                name: "signature",
                maxCount: 1,
            },
        ],
        acceptedTypes: ["image/jpeg", "image/png", "application/pdf"],
        maxSize: 5 * 1024 * 1024,
        minSize: 10 * 1024,
        folder: "banking-app",
    });
};
router.post(
    "/upload-documents",
    userStage("document"),
    upload(),
    uploadDocumnentsController
);

export default router;
