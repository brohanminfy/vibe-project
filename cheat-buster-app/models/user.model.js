import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    picture: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

export default User