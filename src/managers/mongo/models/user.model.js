import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const collection = 'Users';

const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    age: { type: String, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' },
});

schema.pre(
    'save',
    async function (next) {
        if (this.isModified('password') || this.isNew) {
            this.password = bcrypt.hashSync(this.password, 10);
        }
        next();
    },
    { timestamps: true }
);

const usersModel = mongoose.model(collection, schema);

export default usersModel;
