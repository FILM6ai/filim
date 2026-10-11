import mongoose from 'mongoose';
const subscribeEmailSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
export default mongoose.model('subscribeEmail', subscribeEmailSchema);