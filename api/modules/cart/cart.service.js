import { prisma } from "../../lib/prisma";
export const getUserCart = async (userId) => {
    return prisma.cart.findFirst({
        where: { userId },
        include: { items: { include: { product: true } } },
    });
};
export const addToCart = async (userId, productId, quantity) => {
    let cart = await prisma.cart.findFirst({ where: { userId: userId } });
    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
        });
    }
    const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
    });
    if (existingItem) {
        return prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
        });
    }
    // add new item
    return prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
    });
};
export const deleteCartservice = async (cartId) => {
    return prisma.cart.delete({
        where: {
            id: cartId
        }
    });
};
