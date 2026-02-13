import { prisma } from "../../lib/prisma";
const createCategory = async (name) => {
    const category = await prisma.category.create({
        data: {
            name,
        },
        include: {
            medicines: true,
        },
    });
    return category;
};
const getAllCategory = async () => {
    const categories = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
    return categories;
};
export const categoryService = {
    createCategory,
    getAllCategory
};
