import { Router } from "express";
import { orderController } from "./order.controller";
import routeAuth, { UserRole } from "../../middlewares/route-auth";
const router = Router();
router.post("/", routeAuth(UserRole.ADMIN, UserRole.SELLER, UserRole.USER), orderController.createOrder);
router.get("/", routeAuth(UserRole.ADMIN, UserRole.SELLER), orderController.getAllUserOrder);
router.get("/seller", routeAuth(UserRole.SELLER), orderController.getAllSellerOrder);
router.get("/:orderId", routeAuth(UserRole.ADMIN, UserRole.SELLER, UserRole.USER), orderController.getOrderById);
export const orderRouter = router;
