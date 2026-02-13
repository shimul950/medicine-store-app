import { medicineService } from "./medicine.service";
const addMedicine = async (req, res) => {
    try {
        const { name, description, price, stock, categoryName } = req.body;
        const sellerId = req.user?.id;
        if (!name || !price || !stock || !categoryName || !sellerId) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }
        const result = await medicineService.addMedicine({ name, description, price, stock, sellerId, categoryName });
        res.status(201).json({
            success: true,
            message: "Medicine created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to add medicine",
        });
    }
};
const updateMedicine = async (req, res) => {
    try {
        const { idParam } = req.params;
        const { name, description, price, stock, categoryName } = req.body;
        if (!idParam) {
            return res.status(400).json({
                success: false,
                message: "Medicine id is required",
            });
        }
        const result = await medicineService.updateMedicine(idParam, { name, description, price, stock, categoryName });
        res.status(200).json({
            success: true,
            message: "Medicine updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to modify medicine",
        });
    }
};
const deleteMedicine = async (req, res) => {
    try {
        const { idParam } = req.params;
        if (!idParam) {
            return res.status(400).json({
                success: false,
                message: "Medicine id is required",
            });
        }
        const result = await medicineService.deleteMedicine(idParam);
        res.status(200).json({
            success: true,
            message: "Medicine deleted successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete medicine",
        });
    }
};
const getAllMedicine = async (req, res) => {
    try {
        const { featured } = req.query;
        const result = await medicineService.getAllMedicine(featured !== undefined ? featured === "true" : undefined);
        res.status(200).json({
            success: true,
            message: "Medicine fetched successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to find all medicine",
        });
    }
};
const getMedicineById = async (req, res) => {
    try {
        const { idParam } = req.params;
        const result = await medicineService.getMedicineById(idParam);
        res.status(200).json({
            success: true,
            message: "Medicine fetched successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to find medicine",
        });
    }
};
export const medicineController = {
    addMedicine,
    updateMedicine,
    deleteMedicine,
    getAllMedicine,
    getMedicineById
};
