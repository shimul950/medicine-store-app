import { prisma } from "../../lib/prisma";
const addMedicine = async (data) => {
    const category = await prisma.category.findUnique({
        where: { name: data.categoryName },
    });
    if (!category) {
        throw new Error("Category not found");
    }
    const medicine = await prisma.medicine.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            categoryId: category.id,
            sellerId: data.sellerId
        }
    });
    return medicine;
};
const updateMedicine = async (idParam, data) => {
    let categoryId;
    if (data.categoryName) {
        const category = await prisma.category.findFirst({
            where: {
                name: {
                    equals: data.categoryName,
                    mode: "insensitive",
                },
            },
        });
        if (!category) {
            throw new Error("Category not found");
        }
        categoryId = category.id;
    }
    const medicine = await prisma.medicine.update({
        where: { id: idParam },
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            categoryId,
        },
    });
    return medicine;
};
const deleteMedicine = async (id) => {
    const medicine = await prisma.medicine.delete({
        where: {
            id: id
        }
    });
    return medicine;
};
const getAllMedicine = async (featured) => {
    return prisma.medicine.findMany({
        where: featured === undefined ? {} : { featured },
    });
};
const getMedicineById = async (id) => {
    const medicine = await prisma.medicine.findUnique({
        where: {
            id: id
        }
    });
    return medicine;
};
export const medicineService = {
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getAllMedicine,
    getMedicineById
};
