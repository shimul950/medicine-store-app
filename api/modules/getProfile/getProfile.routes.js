import { Router } from "express";
import { getProfileController, updateUser } from "./getProfile.controller";
import routeAuth, { UserRole } from "../../middlewares/route-auth";
const router = Router();
router.get("/", routeAuth(UserRole.ADMIN, UserRole.SELLER, UserRole.USER), getProfileController);
router.patch("/:id", updateUser);
export const getProfileRouter = router;
