import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },

        quantity: {
            type: Number,
            required: true
        },

        unit: String, // kg / box / katta

        price: {
            type: Number,
            required: true
        },

        total: {
            type: Number
        }
    }],

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },

    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'COD'
    },

    isPaid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;
