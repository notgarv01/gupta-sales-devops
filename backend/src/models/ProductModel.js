import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ['chai', 'mehendi', 'manjan', 'matchbox'],
        required: true
    },

    // Unit: kg, box, katta
    unit: {
        type: String,
        enum: ['kg', 'box', 'katta'],
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    // Minimum order quantity
    minOrderQty: {
        type: Number,
        default: 1
    },

    // Pieces inside (like 12 cones, 600 matchsticks etc.)
    piecesPerUnit: {
        type: Number
    },

    // For variants (Meeta Gold, Regular Cone, etc.)
    variant: {
        type: String
    },

    // Brand (Shreemali, Herbal Heena, etc.)
    brand: {
        type: String
    },

    image: String,
    description: String,

    stock: {
        type: Number,
        default: 0
    },

    oldPrice: {
        type: Number
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
