import express, {Application} from "express";
import cors from 'cors'
import errorHandler from "./middlewares/globalErrorHandler";
import { getProfileRouter } from "./modules/getProfile/getProfile.routes";
import { categoryRouter } from "./modules/category/category.route";
import { medicineRouter } from "./modules/medicine/medicine.route";
import { userRouter } from "./modules/user/user.route";
import { orderRouter } from "./modules/order/order.route";

const app:Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true
}))

app.use(express.json())

app.use("/api/auth/profile",getProfileRouter)

app.use("/api/category", categoryRouter)

app.use("/api/medicine", medicineRouter)

app.use("/api/admin", userRouter)

app.use("/api/order", orderRouter)


app.get("/", (req, res) => {
    res.send('hellow world 123')
})


app.use(errorHandler)
export default app;