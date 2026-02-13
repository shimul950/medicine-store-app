import { prisma } from "../../lib/prisma";
const getAllUser = async () => {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
    return users;
};
export const updateUserStatus = async (userId, data) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            role: data.role,
            emailVerified: data.emailVerified,
        },
    });
    return user;
};
export const userService = {
    getAllUser,
    updateUserStatus
};
