import { Router } from "express";
import routeAuth, { UserRole } from "../../middlewares/route-auth";
import { categoryController } from "./category.controller";
const router = Router();
router.post("/create", routeAuth(UserRole.ADMIN), categoryController.createCategory);
router.get("/all", routeAuth(UserRole.ADMIN, UserRole.SELLER, UserRole.USER), categoryController.getAllCategory);
export const categoryRouter = router;
