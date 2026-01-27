import { Router } from "express";
import { getProfileController } from "./getProfile.controller";
import routeAuth, { UserRole } from "../../middlewares/route-auth";


const router = Router();

router.get("/", routeAuth(UserRole.ADMIN, UserRole.SELLER, UserRole.USER) , getProfileController);

export const getProfileRouter : Router = router;
