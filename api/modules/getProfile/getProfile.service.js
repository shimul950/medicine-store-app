import { prisma } from "../../lib/prisma";
export const getProfileService = async (userId) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
        },
    });
};
export const updateUserProfile = async (id, data) => {
    return prisma.user.update({
        where: { id },
        data,
    });
};
