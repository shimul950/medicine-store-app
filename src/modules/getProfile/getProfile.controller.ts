import { Request, Response } from "express";
import { getProfileService } from "./getProfile.service";


export const getProfileController = async (req:Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const result= await getProfileService(user.id);

  res.json(result);
};
