import UserModel from "../models/UserModel.js";
import ProductModel from "../models/ProductModel.js";
import OrderModel from "../models/OrderModel.js";

const getUserProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware with decoded JWT data
        const userId = req.user._id;
        const user = await UserModel.findById(userId)
            .select('-password')
            .populate({
                path: 'orders',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'products.product',
                    select: 'name image'
                }
            });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find().select('-__v');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await UserModel.findById(req.user._id).populate('cart.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Check if product already in cart
        const existingItem = user.cart.find(item => item.product._id.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }
        
        await user.save();
        const updatedUser = await UserModel.findById(req.user._id).populate('cart.product');
        res.status(200).json(updatedUser.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getCart = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).populate('cart.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await UserModel.findById(req.user._id).populate('cart.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const cartItem = user.cart.find(item => item.product._id.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        
        cartItem.quantity = quantity;
        await user.save();
        const updatedUser = await UserModel.findById(req.user._id).populate('cart.product');
        res.status(200).json(updatedUser.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await UserModel.findById(req.user._id).populate('cart.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.cart = user.cart.filter(item => item.product._id.toString() !== productId);
        await user.save();
        const updatedUser = await UserModel.findById(req.user._id).populate('cart.product');
        res.status(200).json(updatedUser.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateAddress = async (req, res) => {
    try {
        const { address, pincode, phone, index } = req.body;
        const user = await UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user phone if provided
        if (phone) {
            user.phone = phone;
        }

        if (!user.addresses) {
            user.addresses = [];
        }

        const addressIndex = index || 0;
        if (user.addresses[addressIndex]) {
            user.addresses[addressIndex] = { address, pincode };
        } else {
            user.addresses.push({ address, pincode });
        }
        await user.save();

        res.status(200).json({ message: 'Address updated successfully', address, pincode, phone: user.phone });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addAddress = async (req, res) => {
    try {
        const { address, pincode, phone } = req.body;
        const user = await UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user phone if provided
        if (phone) {
            user.phone = phone;
        }

        const newAddress = { address, pincode };
        if (!user.addresses) {
            user.addresses = [];
        }
        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({ message: 'Address added successfully', address, pincode, phone: user.phone });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createOrder = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).populate('cart.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const products = user.cart.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            unit: item.product.unit || 'kg',
            price: item.product.price,
            total: item.product.price * item.quantity
        }));

        const totalAmount = products.reduce((sum, item) => sum + item.total, 0);

        const order = new OrderModel({
            user: user._id,
            products,
            totalAmount,
            status: 'Processing',
            paymentMethod: 'COD',
            isPaid: false
        });

        await order.save();

        user.orders.push(order._id);
        user.cart = [];
        await user.save();

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserOrders = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).populate({
            path: 'orders',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'products.product',
                select: 'name image price'
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Transform products to items for frontend compatibility
        const orders = (user.orders || []).map(order => ({
            ...order.toObject(),
            items: order.products.map(p => ({
                product: p.product,
                quantity: p.quantity,
                price: p.price,
                total: p.total
            }))
        }));

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user's orders
        await OrderModel.deleteMany({ user: user._id });

        // Delete user
        await UserModel.findByIdAndDelete(user._id);

        // Clear cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await OrderModel.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'Processing') {
            return res.status(400).json({ message: 'Only processing orders can be cancelled' });
        }

        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default { getUserProfile, getAllProducts, addToCart, getCart, updateCart, removeFromCart, updateAddress, addAddress, createOrder, getUserOrders, deleteAccount, cancelOrder };