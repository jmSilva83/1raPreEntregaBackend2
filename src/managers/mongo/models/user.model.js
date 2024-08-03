import mongoose from 'mongoose';

const collection = 'Users';

const schema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, unique: true, required: true, index: true },
        age: { type: Number, required: true },
        password: { type: String, required: true },
        cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
        role: { type: String, default: 'user' },
    },
    { timestamps: true }
);

const usersModel = mongoose.model(collection, schema);

export default usersModel;
