import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    // Customer info
    shopName: String,
    phone: String,

    // Addresses array (supports multiple addresses)
    addresses: [{
        address: String,
        pincode: Number,
        isDefault: { type: Boolean, default: false }
    }],

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],

    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],

    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);
export default UserModel;