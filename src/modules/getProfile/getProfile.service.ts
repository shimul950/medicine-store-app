
import { prisma } from "../../lib/prisma";

export const getProfileService = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true ,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
};
