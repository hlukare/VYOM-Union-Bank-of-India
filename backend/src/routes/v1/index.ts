import { Router } from "express";
import authRouter from "./auth.router";
import registerRouter from "./register.router";
import authMiddleware from "../../middlewares/auth.middleware";
const router = Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "Hello, From V1!" });
});

router.use("/auth", authRouter);
router.use("/users/register", authMiddleware, registerRouter);

export default router;
