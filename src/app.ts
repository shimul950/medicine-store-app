import express, {Application} from "express";
import cors from 'cors'
import errorHandler from "./middlewares/globalErrorHandler";
import { getProfileRouter } from "./modules/getProfile/getProfile.routes";

const app:Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:5000",
    credentials: true
}))

app.use(express.json())

app.use("/api/auth/profile",getProfileRouter)


app.get("/", (req, res) => {
    res.send('hellow world 123')
})


app.use(errorHandler)
export default app;