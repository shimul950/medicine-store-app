import { Router } from "express";
import { userController } from "./user.controller";
import routeAuth, { UserRole } from "../../middlewares/route-auth";
const router = Router();
router.get("/users", routeAuth(UserRole.ADMIN), userController.getAllUser);
router.patch("/users/:userId", routeAuth(UserRole.ADMIN), userController.updateUserStatus);
export const userRouter = router;
