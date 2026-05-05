import UserModel from '../models/UserModel.js';
import OrderModel from '../models/OrderModel.js';
import ProductModel from '../models/ProductModel.js';

const adminHome = (req, res) => {
    res.json({ message: 'Admin Home' });
};

const addProduct = async (req, res) => {
    try {
        const { name, price, image, type, unit, minOrderQty, piecesPerUnit, variant, brand, description, stock, oldPrice } = req.body;
        
        const product = new ProductModel({
            name,
            price,
            image,
            type,
            unit,
            minOrderQty: minOrderQty || 1,
            piecesPerUnit: piecesPerUnit || null,
            variant: variant || null,
            brand: brand || null,
            description,
            stock: stock || 0,
            oldPrice: oldPrice || null
        });
        
        await product.save();
        
        res.status(201).json({
            message: 'Product added successfully',
            product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                type: product.type,
                unit: product.unit
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        // Total users
        const totalUsers = await UserModel.countDocuments({ role: 'user' });

        // Total orders
        const totalOrders = await OrderModel.countDocuments();

        // Total revenue
        const revenueResult = await OrderModel.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Total products
        const totalProducts = await ProductModel.countDocuments();

        // Low stock products (less than 20 units - assuming products have stock field)
        const lowStockProducts = await ProductModel.find({ stock: { $lt: 20 } })
            .limit(5)
            .select('name stock');

        // Recent orders
        const recentOrders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name')
            .populate('products.product', 'name');

        // Orders by status
        const ordersByStatus = await OrderModel.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            stats: {
                totalRevenue,
                totalOrders,
                totalUsers,
                totalProducts
            },
            lowStockProducts: lowStockProducts.map(p => ({
                name: p.name,
                stock: p.stock || Math.floor(Math.random() * 20),
                pct: Math.floor((p.stock || 5) / 100 * 100)
            })),
            recentOrders: recentOrders.map(o => ({
                user: o.user?.name || 'Unknown',
                price: `₹${o.totalAmount}`,
                status: o.status,
                products: o.products.map(p => p.product?.name || 'Unknown Product').join(', ')
            })),
            ordersByStatus: ordersByStatus.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {})
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name email phone addresses shopName')
            .populate('products.product', 'name image price unit');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSingleOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderModel.findById(orderId)
            .populate('user', 'name email phone addresses shopName')
            .populate('products.product', 'name image price unit description');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const customers = await UserModel.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await OrderModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('products.product', 'name image price');
        
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('user', 'name email')
         .populate('products.product', 'name image price');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find().select('-__v');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    adminHome,
    addProduct,
    getDashboardStats,
    getAllOrders,
    getSingleOrder,
    getAllCustomers,
    getUserOrders,
    updateOrderStatus,
    getAllProducts
};